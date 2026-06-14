import {
  Alert,
  App,
  Button,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Tag,
} from 'antd';
import { motion } from 'framer-motion';
import { BrainCircuit, CheckCircle2, KeyRound, PlugZap, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { api } from '../services/api';
import type { ModelConfig } from '../types/domain';

type ModelConfigForm = {
  enabled: boolean;
  provider: ModelConfig['provider'];
  apiMode: ModelConfig['apiMode'];
  baseUrl: string;
  model: string;
  apiKey?: string;
};

export function ModelConfigPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm<ModelConfigForm>();
  const [config, setConfig] = useState<ModelConfig | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const loadConfig = async () => {
    try {
      const next = await api.getModelConfig();
      setConfig(next);
      setLoadError(null);
      form.setFieldsValue({
        enabled: next.enabled ?? true,
        provider: next.provider,
        apiMode: next.apiMode,
        baseUrl: next.baseUrl,
        model: next.model,
        apiKey: '',
      });
    } catch (error) {
      setConfig(null);
      setLoadError(error instanceof Error ? error.message : '无法读取模型配置，请确认本地 API 已启动。');
    }
  };

  useEffect(() => {
    void loadConfig();
  }, []);

  const handleProviderChange = (provider: ModelConfig['provider']) => {
    if (provider === 'openai') {
      form.setFieldsValue({
        apiMode: 'responses',
        baseUrl: 'https://api.openai.com/v1',
        model: form.getFieldValue('model') || 'gpt-5.4-mini',
      });
      return;
    }

    if (provider === 'volcengine_ark') {
      form.setFieldsValue({
        apiMode: 'responses',
        baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
        model: 'doubao-seed-2-0-pro-260215',
      });
      return;
    }

    form.setFieldsValue({ apiMode: 'chat_completions' });
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (!config?.hasApiKey && !values.apiKey?.trim()) {
      message.warning('首次保存请填写 API Key');
      return;
    }

    setSaving(true);
    try {
      const next = await api.updateModelConfig({
        ...values,
        enabled: values.enabled ?? true,
        apiKey: values.apiKey?.trim() || undefined,
      });
      setConfig(next);
      form.setFieldValue('apiKey', '');
      window.dispatchEvent(new Event('model-config-updated'));
      message.success('模型配置与 API Key 已保存');
    } catch (error) {
      message.error(error instanceof Error ? error.message : '保存模型配置失败');
    } finally {
      setSaving(false);
    }
  };

  const watchedApiKey = Form.useWatch('apiKey', form);
  const watchedBaseUrl = Form.useWatch('baseUrl', form);
  const watchedModel = Form.useWatch('model', form);

  const canTest =
    Boolean(config?.testable) ||
    Boolean(watchedApiKey?.trim() && watchedBaseUrl?.trim() && watchedModel?.trim());

  const handleTest = async () => {
    setTesting(true);
    try {
      const values = await form.validateFields();
      if (!config?.hasApiKey && !values.apiKey?.trim()) {
        message.warning('请先填写 API Key');
        return;
      }

      const next = await api.updateModelConfig({
        ...values,
        apiKey: values.apiKey?.trim() || undefined,
      });
      setConfig(next);
      form.setFieldValue('apiKey', '');
      window.dispatchEvent(new Event('model-config-updated'));

      const result = await api.testModel();
      setConfig(result.config);
      message.success(result.message);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '测试连接失败');
    } finally {
      setTesting(false);
    }
  };

  const locked = config ? !config.runtimeConfigAllowed : false;

  return (
    <motion.div className="model-config-page" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard strong>
        <SectionHeader
          title="模型配置"
          description="连接真实大模型，用于分析用户目标、生成语义节点与关系，并输出投教方案。"
          extra={
            <StatusBadge
              tone={config?.configured ? 'success' : 'warning'}
              icon={config?.configured ? <CheckCircle2 size={13} /> : <BrainCircuit size={13} />}
            >
              {config?.configured ? '模型已就绪' : '模型未配置'}
            </StatusBadge>
          }
        />
        <div className="model-config-summary">
          <div>
            <span>配置来源</span>
            <strong>{config?.source === 'runtime' ? '页面临时配置' : '服务端环境变量'}</strong>
          </div>
          <div>
            <span>密钥状态</span>
            <strong>{config?.hasApiKey ? config.apiKeyPreview : '未设置'}</strong>
          </div>
          <div>
            <span>调用模式</span>
            <strong>{config?.apiMode === 'responses' ? 'Responses API' : 'Chat Completions'}</strong>
          </div>
        </div>
      </GlassCard>

      <div className="model-config-grid">
        <GlassCard>
          <SectionHeader title="连接设置" description="密钥只提交给本项目后端，不写入浏览器存储，也不会从接口返回明文。" />
          {loadError ? (
            <Alert
              type="error"
              showIcon
              message="无法连接后端 API"
              description={`${loadError}。请确认 API 服务已启动，且前端通过 /api 能访问到后端。`}
              style={{ marginBottom: 16, borderRadius: 14 }}
            />
          ) : null}
          {locked ? (
            <Alert
              type="warning"
              showIcon
              message="当前环境已禁止页面修改模型配置，请在服务端环境变量中设置。"
              style={{ marginBottom: 16, borderRadius: 14 }}
            />
          ) : null}
          <Form<ModelConfigForm>
            form={form}
            layout="vertical"
            disabled={locked || Boolean(loadError)}
            initialValues={{
              enabled: true,
              provider: 'volcengine_ark',
              apiMode: 'responses',
              baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
              model: 'doubao-seed-2-0-pro-260215',
            }}
          >
            <Form.Item name="enabled" label="启用真实模型" valuePropName="checked">
              <Switch checkedChildren="已启用" unCheckedChildren="未启用" />
            </Form.Item>
            <Form.Item name="provider" label="模型服务" rules={[{ required: true }]}>
              <Select
                onChange={handleProviderChange}
                options={[
                  { label: '火山方舟 Doubao (Responses API)', value: 'volcengine_ark' },
                  { label: 'OpenAI', value: 'openai' },
                  { label: 'OpenAI-compatible', value: 'openai_compatible' },
                ]}
              />
            </Form.Item>
            <Form.Item name="apiMode" label="API 模式" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: 'Responses API', value: 'responses' },
                  { label: 'Chat Completions', value: 'chat_completions' },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="baseUrl"
              label="Base URL"
              rules={[
                { required: true, message: '请输入模型服务地址' },
                { type: 'url', message: '请输入有效的 HTTP/HTTPS 地址' },
              ]}
            >
              <Input placeholder="https://ark.cn-beijing.volces.com/api/v3" />
            </Form.Item>
            <Form.Item name="model" label="模型名称" rules={[{ required: true, message: '请输入模型名称' }]}>
              <Input placeholder="doubao-seed-2-0-pro-260215" />
            </Form.Item>
            <Form.Item
              name="apiKey"
              label="API Key"
              extra={config?.hasApiKey ? '留空会保留当前密钥。' : '首次配置必须填写密钥。'}
            >
              <Input.Password
                prefix={<KeyRound size={15} />}
                autoComplete="new-password"
                placeholder={config?.hasApiKey ? '已保存，留空保持不变' : '输入服务端 API Key'}
              />
            </Form.Item>
            <Space wrap>
              <Button type="primary" icon={<Save size={15} />} loading={saving} onClick={handleSave}>
                保存配置
              </Button>
              <Button
                icon={<PlugZap size={15} />}
                loading={testing}
                disabled={!canTest || locked || Boolean(loadError)}
                onClick={handleTest}
              >
                测试连接
              </Button>
            </Space>
          </Form>
        </GlassCard>

        <GlassCard>
          <SectionHeader title="模型作用范围" description="配置成功后，主工作台会走真实模型链路。" />
          <div className="model-capability-list">
            <div className="mini-row">
              <p className="mini-row-title">分析用户输入</p>
              <p className="mini-row-body">提取目标、风险偏好、经验、主题关注和需要优先解释的风险。</p>
            </div>
            <div className="mini-row">
              <p className="mini-row-title">控制节点生成</p>
              <p className="mini-row-body">模型返回节点与关系结构，前端自动排版后添加到当前语义世界画布。</p>
            </div>
            <div className="mini-row">
              <p className="mini-row-title">生成投教方案</p>
              <p className="mini-row-body">输出适用人群、配置理解路径、关键风险和已有证据绑定。</p>
            </div>
          </div>
          <Alert
            type="info"
            showIcon
            message="页面配置会保存到本地 data/runtime-model.local.json，API Key 不会返回前端明文，也不会写入浏览器存储。"
            style={{ marginTop: 16, borderRadius: 14 }}
          />
          <div className="metric-row" style={{ marginTop: 14 }}>
            <Tag color="blue">结构化输出</Tag>
            <Tag color="cyan">服务端代理</Tag>
            <Tag color="gold">投教边界</Tag>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
