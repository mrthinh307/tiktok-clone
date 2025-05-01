import { AutoScrollIcon, CaptionIcon, MarkIrrelevantIcon, MiniPlayerIcon, ReportIcon } from "~/assets/images/icons";
import { ToggleButton } from "~/components/Button";
import { useAutoScroll } from "~/contexts/AutoScrollContext";

export const ELLIPSIS_OPTIONS = [
    {
        icon: <CaptionIcon />,
        title: 'Captions',
    },
    {
        icon: <AutoScrollIcon />,
        title: 'Auto scroll',
        icon2: <ToggleButton 
            useContext={true}
            contextHook={useAutoScroll}
            contextStateKey="isAutoScrollEnabled"
            contextToggleKey="toggleAutoScroll"
        />,
    },
    {
        icon: <MiniPlayerIcon />,
        title: 'Miniplayer',
    },
    {
        icon: <MarkIrrelevantIcon />,
        title: 'Not interested',
    },
    {
        icon: <ReportIcon />,
        title: 'Report',
    },
]

export const ELLIPSIS_POPPER_PROPS = {
    buttonPadding: 'small',
    iconSize: 'small',
    hoverType: 'background',
    primary: true,
    offset: [180, 4],
    trigger: 'click',
    hideOnClick: true,
};