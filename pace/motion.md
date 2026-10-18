---
aside: false
---
# Pace motion

Motion explains change, it does not decorate.

| Moment | Motion | Duration |
| --- | --- | --- |
| Screen arrival | Fade and rise 10px, staggered 50ms | 400ms |
| Counters (bookings, credits) | Count up once | 900ms |
| Booking feedback | Toast slides in, auto-dismisses | 3.2s |
| Buttons | 1px press, border color change | 160ms |

Rules: animate transform and opacity only. Timers and animations stop when the component unmounts. With `prefers-reduced-motion: reduce`, numbers appear final and nothing animates. Loading states use skeletons, not spinners over content.
