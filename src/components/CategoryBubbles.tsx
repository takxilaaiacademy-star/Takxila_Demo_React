import { memo, useCallback, useMemo, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Collapse,
  Stack,
  Theme,
  Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { GROUPS } from "../data/courses";
import type { Course, GroupId } from "../types";
import { CourseGrid } from "./CourseCard";
import { BlobImg } from "./Media";

// JSON configuration consolidating repeated styles, limits, and UI tokens
const CONFIG = {
  maxAvatars: 4,
  collapseTimeout: 250,
  labels: {
    collapseAll: "Collapse all",
    expandAll: "Expand all",
  },
  styles: {
    container: (t: Theme) => ({
      border: `1px solid ${t.tx.line}`,
      borderRadius: "16px",
      p: { xs: 1, sm: 1.5 },
      background: t.tx.surface,
    }),
    bubbleBtn: {
      all: "unset",
      boxSizing: "border-box",
      width: "100%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      px: { xs: 1.5, sm: 2.5 },
      py: { xs: 1.5, sm: 1.75 },
      borderRadius: "10px",
      color: "#fff",
      background: "linear-gradient(90deg, #13215e, #1b2b78)",
      boxShadow: "0 6px 18px rgba(11,22,70,.25)",
      transition: "transform .2s, box-shadow .2s",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 10px 26px rgba(11,22,70,.35)",
      },
      "&:focus-visible": { outline: "2px solid #F5B93F", outlineOffset: 2 },
    },
    chevron: (open: boolean) => ({
      transition: "transform .25s",
      transform: open ? "rotate(90deg)" : "none",
    }),
    title: { fontWeight: 800, fontSize: { xs: 15, sm: 17 }, lineHeight: 1.3 },
    subtitle: { fontSize: 13, opacity: 0.8 },
    avatarGroup: {
      display: { xs: "none", sm: "flex" },
      "& .MuiAvatar-root": {
        width: 34,
        height: 34,
        fontSize: 12,
        borderColor: "#1b2b78",
      },
    },
    avatar: { bgcolor: "#2a3a8f" },
    blobImg: { width: "100%", height: "100%" },
    collapseBox: { pt: 2, pb: 1, px: { xs: 0, sm: 0.5 } },
    groupBadge: (t: Theme) => ({
      fontWeight: 700,
      mb: 2,
      px: 1.5,
      py: 1,
      borderRadius: "8px",
      border: `1px solid ${t.tx.line}`,
    }),
  },
} as const;

const ORDER = Object.keys(GROUPS) as GroupId[];

/** Single-pass course pricing and count summary */
const getSummary = (list: Course[]) => {
  let min = Infinity, free = 0;
  for (const c of list) {
    if (c.price <= 0) free++;
    else if (c.price < min) min = c.price;
  }
  return [
    `${list.length} ${list.length === 1 ? "course" : "courses"}`,
    free ? `${free} free` : "",
    min < Infinity ? `from ₹${min}` : "",
  ].filter(Boolean).join(" · ");
};

/**
 * Category bubbles: expandable bars per category with course count & previews.
 * Courses only render upon bubble expansion to keep DOM light and responsive.
 */
export default function CategoryBubbles({
  courses,
  open: initial = [],
}: {
  courses: Course[];
  open?: GroupId[];
}) {
  const groups = useMemo(() => {
    const map = new Map<GroupId, Course[]>();
    for (const c of courses) {
      const arr = map.get(c.group);
      if (arr) arr.push(c);
      else map.set(c.group, [c]);
    }
    return ORDER.filter((g) => map.has(g)).map((g) => ({
      g,
      list: map.get(g)!,
    }));
  }, [courses]);

  const [open, setOpen] = useState<GroupId[]>(initial);
  const allOpen = groups.length > 0 && groups.every((x) => open.includes(x.g));

  const toggle = useCallback((g: GroupId) => {
    setOpen((o) => (o.includes(g) ? o.filter((x) => x !== g) : [...o, g]));
  }, []);

  return (
    <Box sx={CONFIG.styles.container}>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setOpen(allOpen ? [] : groups.map((x) => x.g))}
        >
          {allOpen ? CONFIG.labels.collapseAll : CONFIG.labels.expandAll}
        </Button>
      </Stack>
      <Stack spacing={1.25}>
        {groups.map(({ g, list }) => (
          <Bubble
            key={g}
            g={g}
            list={list}
            open={open.includes(g)}
            onToggle={toggle}
          />
        ))}
      </Stack>
    </Box>
  );
}

const Bubble = memo(function Bubble({
  g,
  list,
  open,
  onToggle,
}: {
  g: GroupId;
  list: Course[];
  open: boolean;
  onToggle: (g: GroupId) => void;
}) {
  const title = GROUPS[g];
  const summary = useMemo(() => getSummary(list), [list]);

  return (
    <Box>
      <Box
        component="button"
        type="button"
        onClick={() => onToggle(g)}
        aria-expanded={open}
        sx={CONFIG.styles.bubbleBtn}
      >
        <ChevronRightIcon sx={CONFIG.styles.chevron(open)} />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography sx={CONFIG.styles.title}>{title}</Typography>
          <Typography sx={CONFIG.styles.subtitle}>{summary}</Typography>
        </Box>
        <AvatarGroup max={CONFIG.maxAvatars} sx={CONFIG.styles.avatarGroup}>
          {list.map((c) => (
            <Avatar key={c.id} alt="" variant="rounded" sx={CONFIG.styles.avatar}>
              <BlobImg src={c.img} alt="" sx={CONFIG.styles.blobImg} />
            </Avatar>
          ))}
        </AvatarGroup>
      </Box>
      <Collapse in={open} unmountOnExit timeout={CONFIG.collapseTimeout}>
        <Box sx={CONFIG.styles.collapseBox}>
          <Typography sx={CONFIG.styles.groupBadge}>{title}</Typography>
          <CourseGrid courses={list} />
        </Box>
      </Collapse>
    </Box>
  );
});
