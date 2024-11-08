import ImageProcessor from './components/ImageProcessor';
import JsonYamlConverter from './components/JsonYamlConverter';
import QRCodeGenerator from './components/QRCodeGenerator';
import MarkdownEditor from './components/MarkdownEditor';
import ImageEffectsTool from './components/ImageEffects/ImageEffectsTool';
import {
  Transform as TransformIcon,
  Image as ImageIcon,
  QrCode as QrCodeIcon,
  TextFields as MarkdownIcon,
  Brush as EffectsIcon,
  AutoFixHigh as AdvancedEffectsIcon
} from '@mui/icons-material';

export const routes = [
  {
    path: '/',
    label: '图片处理',
    component: ImageProcessor,
    icon: ImageIcon
  },
  {
    path: '/effects',
    label: '图片特效',
    component: ImageEffectsTool,
    icon: AdvancedEffectsIcon
  },
  {
    path: '/json-yaml',
    label: 'JSON-YAML',
    component: JsonYamlConverter,
    icon: TransformIcon
  },
  {
    path: '/qrcode',
    label: '二维码',
    component: QRCodeGenerator,
    icon: QrCodeIcon
  },
  {
    path: '/markdown',
    label: 'Markdown',
    component: MarkdownEditor,
    icon: MarkdownIcon
  }
];

export default routes; 