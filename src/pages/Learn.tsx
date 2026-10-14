import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FullscreenIcon from "@mui/icons-material/FullscreenRounded";
import OpenInNewIcon from "@mui/icons-material/OpenInNewRounded";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebarOutlined";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/CallOutlined";
import LockOpenIcon from "@mui/icons-material/LockOpenRounded";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Logo from "../components/Logo";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { TEL_HREF } from "../config/site";
import { lessonsFor } from "../data/curriculum";
import { isAllowedPlayerUrl, playerUrlFor } from "../data/player";
import { courseById } from "../data/recommend";
import { useAppSelector } from "../store";
import { whatsappLink } from "../utils/contact";

/**
 * Learn page: the course player.
 * The academy lesson plays in a large frame, with a progress panel beside it.
 * Opens for enrolled learners (and for the admin in Admin mode, to preview any course).
 */
export default function Learn() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const { user, isAdmin } = useAuth();
  const { owned, prog, lessons, completeLesson } = useStore();
  const overrides = useAppSelector((s) => s.admin.playerUrls);
  const c = courseById(id);

  const stageRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [focus, setFocus] = useState(false);

  const src = useMemo(() => playerUrlFor(id, overrides), [id, overrides]);
  const safe = isAllowedPlayerUrl(src);

  // Show a "taking a while" hint if the lesson has not loaded after 8 seconds.
  useEffect(() => {
    setLoaded(false);
    setSlow(false);
    const t = setTimeout(() => setSlow(true), 8000);
    return () => clearTimeout(t);
  }, [src]);

  if (!c) return <Navigate to="/my-courses" replace />;
  if (!owned.includes(c.id) && !isAdmin)
    return <Navigate to={"/courses/" + c.id} replace />;

  const list = lessonsFor(c);
  const done = lessons[c.id] || 0;
  const pct = prog[c.id] || 0;
  const finished = done >= list.length;
  const adminPreview = isAdmin && !owned.includes(c.id);
  const help = `Hi Takxila team, I'm ${user?.name ?? "a learner"}. I need help with "${c.title}".`;

  const fullscreen = () => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  };

  // Extra attributes some browsers still want on the frame, passed through as plain attributes.
  const legacyFullscreen = {
    webkitallowfullscreen: "true",
    mozallowfullscreen: "true",
  } as Record<string, string>;

  return (
    <Box sx={{ pb: { xs: 4, md: 8 } }}>
      {/* Hero strip: back button, title and a quick status */}
      <Box
        sx={{
          mt: { xs: 2, md: 3 },
          pt: { xs: 2.5, md: 3.5 },
          pb: { xs: 5, md: 7 },
          background:
            "radial-gradient(900px 300px at 85% -20%, rgba(245,185,63,.28), transparent 60%), radial-gradient(700px 320px at 0% 0%, rgba(106,63,224,.45), transparent 60%), linear-gradient(120deg, #0b1022 0%, #141a3a 60%, #1d1450 100%)",
          color: "#fff",
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ mb: 2 }}
          >
            <Button
              onClick={() => nav(-1)}
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                mb: 2.5,
                px: 2.2,
                py: 0.7,
                borderRadius: "999px",
                color: "#fff",
                fontSize: "0.85rem",
                fontWeight: 600,
                textTransform: "none",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.16)",
                backdropFilter: "blur(16px)",
                transition: "all 0.22s ease-in-out",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.18)",
                  borderColor: "rgba(255, 255, 255, 0.35)",
                  transform: "translateX(-3px)",
                },
              }}
            >
              Back
            </Button>
            {adminPreview && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 99,
                  fontSize: 12.5,
                  fontWeight: 800,
                  bgcolor: "rgba(245,185,63,.2)",
                  color: "#F5B93F",
                  border: "1px solid rgba(245,185,63,.5)",
                }}
              >
                Admin preview
              </Box>
            )}
          </Stack>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontSize: { xs: 24, md: 38 },
              lineHeight: 1.15,
              maxWidth: 900,
            }}
          >
            {c.title}
          </Typography>
          <Typography
            sx={{
              mt: 1,
              opacity: 0.85,
              maxWidth: 720,
              fontSize: { xs: 15, md: 17 },
            }}
          >
            {c.short}
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 2 }}>
            {[`${list.length} lessons`, `${pct}% done`, c.meta[0]]
              .filter(Boolean)
              .map((m) => (
                <Box
                  key={m}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 99,
                    fontSize: 13,
                    fontWeight: 700,
                    background: "rgba(255,255,255,.12)",
                    border: "1px solid rgba(255,255,255,.22)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {m}
                </Box>
              ))}
          </Stack>
        </Container>
      </Box>

      <Container
        maxWidth="xl"
        sx={{ mt: { xs: -3.5, md: -5 }, position: "relative", zIndex: 2 }}
      >
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* The lesson player */}
          <Grid item xs={12} lg={focus ? 12 : 8.5}>
            <Box
              ref={stageRef}
              sx={{
                p: "2px",
                borderRadius: "26px",
                background:
                  "linear-gradient(135deg, #F5B93F, #9B3FD0 45%, #4868FF)",
                boxShadow:
                  "0 30px 80px rgba(72,104,255,.28), 0 10px 30px rgba(0,0,0,.35)",
                "&:fullscreen": {
                  borderRadius: 0,
                  p: 0,
                  background: "#070b18",
                },
              }}
            >
              <Box
                sx={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  bgcolor: "#070b18",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    px: { xs: 1.5, md: 2.5 },
                    py: 1,
                    color: "#fff",
                    borderBottom: "1px solid rgba(255,255,255,.1)",
                  }}
                >
                  <Logo size={26} withText={false} />
                  <Typography
                    noWrap
                    sx={{ fontWeight: 700, fontSize: 14, flexGrow: 1 }}
                  >
                    {c.kicker}
                  </Typography>
                  <Tooltip title={focus ? "Show lesson panel" : "Focus mode"}>
                    <IconButton
                      size="small"
                      onClick={() => setFocus((f) => !f)}
                      sx={{
                        color: "#fff",
                        display: { xs: "none", lg: "inline-flex" },
                      }}
                      aria-label="Toggle focus mode"
                    >
                      <ViewSidebarIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Full screen">
                    <IconButton
                      size="small"
                      onClick={fullscreen}
                      sx={{ color: "#fff" }}
                      aria-label="Full screen"
                    >
                      <FullscreenIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Open in a new tab">
                    <IconButton
                      size="small"
                      component="a"
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: "#fff" }}
                      aria-label="Open lesson in a new tab"
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Box
                  sx={{
                    position: "relative",
                    height: { xs: "62vh", md: "min(76vh, 780px)" },
                    minHeight: 420,
                    "&:fullscreen, :fullscreen &": {
                      height: "calc(100vh - 52px)",
                    },
                  }}
                >
                  {!loaded && (
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      spacing={2}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        color: "#c0c7de",
                        textAlign: "center",
                        px: 3,
                        background:
                          "radial-gradient(500px 260px at 50% 40%, rgba(106,63,224,.25), transparent 70%)",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: 84,
                          height: 84,
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <CircularProgress
                          size={84}
                          thickness={2.2}
                          sx={{
                            position: "absolute",
                            inset: 0,
                            color: "#F5B93F",
                          }}
                        />
                        <Logo size={40} withText={false} />
                      </Box>
                      <Typography sx={{ fontWeight: 700, color: "#fff" }}>
                        Getting your lesson ready…
                      </Typography>
                      {slow && (
                        <Typography sx={{ fontSize: 13.5, maxWidth: 380 }}>
                          Taking longer than usual. Sign in to
                          academy.takxila.in in this browser, or{" "}
                          <Box
                            component="a"
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: "#F5B93F", fontWeight: 700 }}
                          >
                            open the lesson in a new tab
                          </Box>
                          .
                        </Typography>
                      )}
                    </Stack>
                  )}
                  {safe ? (
                    <iframe
                      key={src}
                      id="scorm_object"
                      title={c.title}
                      src={src}
                      allowFullScreen
                      allow="fullscreen; autoplay; clipboard-write; encrypted-media"
                      onLoad={() => setLoaded(true)}
                      {...legacyFullscreen}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: 0,
                        display: "block",
                        opacity: loaded ? 1 : 0,
                        transition: "opacity .4s",
                      }}
                    />
                  ) : (
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        height: "100%",
                        color: "#fff",
                        px: 3,
                        textAlign: "center",
                      }}
                    >
                      <Typography sx={{ fontWeight: 700 }}>
                        This lesson link is not allowed.
                      </Typography>
                      <Typography sx={{ opacity: 0.8, fontSize: 14 }}>
                        Player links must be https links on takxila.in. Ask the
                        admin to fix it.
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Box>
            </Box>
            <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: 13 }}>
              Black screen or a login page? Sign in to{" "}
              <strong>academy.takxila.in</strong> in this browser once, then
              reload.
            </Typography>
          </Grid>

          {/* Progress and lessons */}
          {!focus && (
            <Grid item xs={12} lg={3.5}>
              <Stack
                spacing={2.5}
                sx={{ position: { lg: "sticky" }, top: { lg: 100 } }}
              >
                <Box
                  sx={(t) => ({
                    p: 2.5,
                    borderRadius: "22px",
                    background: t.tx.surface,
                    border: `1px solid ${t.tx.line}`,
                    backdropFilter: "blur(22px)",
                  })}
                >
                  <Stack direction="row" spacing={2.5} alignItems="center">
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <CircularProgress
                        variant="determinate"
                        value={100}
                        size={92}
                        thickness={4}
                        sx={(t) => ({ color: t.tx.line, position: "absolute" })}
                      />
                      <CircularProgress
                        variant="determinate"
                        value={pct}
                        size={92}
                        thickness={4}
                        color={pct >= 100 ? "success" : "secondary"}
                        sx={{ "& circle": { strokeLinecap: "round" } }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Typography sx={{ fontWeight: 800, fontSize: 22 }}>
                          {pct}%
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography
                        sx={{ fontWeight: 800, fontSize: 18, lineHeight: 1.2 }}
                      >
                        {finished ? "Course complete" : "Keep going"}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: 14, mt: 0.5 }}
                      >
                        {done} of {list.length} lessons done
                      </Typography>
                    </Box>
                  </Stack>
                  {finished ? (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<WorkspacePremiumIcon />}
                      onClick={() => nav("/certificates")}
                      sx={{ mt: 2.25 }}
                    >
                      Get my certificate
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<CheckRoundedIcon />}
                      onClick={() => completeLesson(c.id)}
                      disabled={adminPreview}
                      sx={{ mt: 2.25 }}
                    >
                      I finished lesson {done + 1}
                    </Button>
                  )}
                </Box>

                <Box
                  sx={(t) => ({
                    p: 2,
                    borderRadius: "22px",
                    background: t.tx.surface,
                    border: `1px solid ${t.tx.line}`,
                    backdropFilter: "blur(22px)",
                    maxHeight: 360,
                    overflow: "auto",
                  })}
                >
                  <Typography sx={{ fontWeight: 800, mb: 1, px: 0.5 }}>
                    Your lessons
                  </Typography>
                  <Stack spacing={0.5}>
                    {list.map((m, i) => {
                      const complete = i < done;
                      const next = i === done;
                      return (
                        <Stack
                          key={i}
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          sx={(t) => ({
                            p: 1,
                            borderRadius: "12px",
                            ...(next && {
                              background: t.tx.glow,
                              border: `1px solid ${t.tx.hl}`,
                            }),
                          })}
                        >
                          <Box
                            sx={{
                              width: 26,
                              height: 26,
                              flex: "0 0 26px",
                              borderRadius: "50%",
                              display: "grid",
                              placeItems: "center",
                              fontSize: 12,
                              fontWeight: 800,
                              bgcolor: complete
                                ? "success.main"
                                : "transparent",
                              color: complete ? "#fff" : "text.secondary",
                              border: complete ? "none" : "1.5px solid",
                              borderColor: next ? "secondary.main" : "divider",
                            }}
                          >
                            {complete ? (
                              <CheckRoundedIcon sx={{ fontSize: 16 }} />
                            ) : (
                              i + 1
                            )}
                          </Box>
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: next ? 700 : 500,
                              opacity: complete ? 0.65 : 1,
                            }}
                          >
                            {m}
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Box>

                <Box
                  sx={(t) => ({
                    p: 2,
                    borderRadius: "22px",
                    border: `1px dashed ${t.tx.line}`,
                  })}
                >
                  <Typography sx={{ fontWeight: 800 }}>
                    Stuck on something?
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: 13.5, mb: 1.5 }}
                  >
                    A real person replies. Call or message us.
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CallIcon />}
                      component="a"
                      href={TEL_HREF}
                      sx={{ flex: 1 }}
                    >
                      Call
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<WhatsAppIcon />}
                      component="a"
                      href={whatsappLink(help)}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ flex: 1 }}
                    >
                      WhatsApp
                    </Button>
                  </Stack>
                </Box>
                {adminPreview && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ color: "text.secondary", fontSize: 13 }}
                  >
                    <LockOpenIcon fontSize="small" />{" "}
                    <span>
                      You are previewing this course as admin. Progress is not
                      saved.
                    </span>
                  </Stack>
                )}
              </Stack>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
