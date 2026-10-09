import { memo } from 'react';
import { Box } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import SmartToyIcon from '@mui/icons-material/SmartToyOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CodeIcon from '@mui/icons-material/Code';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MovieIcon from '@mui/icons-material/MovieCreationOutlined';
import ImageIcon from '@mui/icons-material/ImageOutlined';
import BrushIcon from '@mui/icons-material/BrushOutlined';
import CampaignIcon from '@mui/icons-material/CampaignOutlined';
import TableChartIcon from '@mui/icons-material/TableChartOutlined';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import ChatIcon from '@mui/icons-material/ChatOutlined';
import WebIcon from '@mui/icons-material/WebOutlined';
import WorkIcon from '@mui/icons-material/WorkOutline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEventsOutlined';
import ChildCareIcon from '@mui/icons-material/ChildCareOutlined';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountTreeIcon from '@mui/icons-material/AccountTreeOutlined';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import FaceIcon from '@mui/icons-material/FaceRetouchingNatural';
import SearchIcon from '@mui/icons-material/Search';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import VideocamIcon from '@mui/icons-material/VideocamOutlined';
import type { CatId, Course } from '../types';

// One icon per course, picked from its id and tags.
const BY_ID: Record<string, SvgIconComponent> = {
  'wa-agent': WhatsAppIcon, 'wa-mastery': WhatsAppIcon, junior: ChildCareIcon, 'claude-code': CodeIcon, 'claude-excel': TableChartIcon,
  perplexity: TravelExploreIcon, lovable: WebIcon, 'nocode-web': WebIcon, 'canva-ai': BrushIcon, 'ai-finance': ShowChartIcon,
  'ai-pm': AccountTreeIcon, 'ai-projects': AccountTreeIcon, 'ai-seo': SearchIcon, 'gads-mastery': AdsClickIcon, 'gads-setup': AdsClickIcon,
  'meta-ads': CampaignIcon, 'ai-marketing': CampaignIcon, portfolio: WorkIcon, 'job-agent': WorkIcon, 'film-4': GraphicEqIcon,
  'film-9': GraphicEqIcon, 'film-5': FaceIcon, 'kling-master': VideocamIcon, 'kling-basics': VideocamIcon, 'mj-advanced': ImageIcon, 'mj-entry': ImageIcon,
};
const BY_CAT: Record<CatId, SvgIconComponent> = {
  challenge: EmojiEventsIcon, agents: SmartToyIcon, claude: AutoAwesomeIcon, tools: ChatIcon, creative: ImageIcon,
  nocode: WebIcon, business: CampaignIcon, career: WorkIcon, film: MovieIcon,
};
export const CAT_COLORS: Record<CatId, [string, string]> = {
  challenge: ['#F5B93F', '#E8742C'], agents: ['#2EBD85', '#0E7C66'], claude: ['#E2875B', '#B5532C'], tools: ['#4D7CFF', '#2B2BD6'],
  creative: ['#C25BFF', '#7B2FD1'], nocode: ['#21B8D6', '#1866C2'], business: ['#FF6B8B', '#C2365A'], career: ['#7C8CFF', '#4552C8'], film: ['#FF8A3D', '#B83A16'],
};

export const iconFor = (c: Course): SvgIconComponent => BY_ID[c.id] || BY_CAT[c.cat];

/** Rounded gradient tile with the course icon, like the course list on tutedude.com. */
export const CourseIcon = memo(function CourseIcon({ c, size = 48 }: { c: Course; size?: number }) {
  const Icon = iconFor(c);
  const [a, b] = CAT_COLORS[c.cat];
  return (
    <Box
      aria-hidden
      className="tx-cicon"
      sx={{
        width: size, height: size, flex: 'none', borderRadius: size / 4 + 'px', display: 'grid', placeItems: 'center', color: '#fff',
        background: `linear-gradient(135deg, ${a}, ${b})`, boxShadow: `0 8px 20px ${a}55, inset 0 1px 0 rgba(255,255,255,.35)`,
        transition: 'transform .4s cubic-bezier(.2,.8,.2,1)',
      }}
    >
      <Icon sx={{ fontSize: size * 0.56 }} />
    </Box>
  );
});
