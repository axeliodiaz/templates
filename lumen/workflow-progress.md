<script setup>
import WorkflowProgress from '../.vitepress/theme/WorkflowProgress.vue'
</script>

# Workflow progress (Lumen)

A vertical workflow progress list in the Lumen design language, inspired by the agent work components in [this post](https://x.com/shedsgns/status/2115307573553647878): a connector line that is progressively drawn toward the active step, a pulsing marker and a subtle shimmer on the working label, sub-steps under the active step, and distinct pending, completed and approval states. Quiet light surfaces and the Lumen violet. Reinterpreted, not a copy. All names and data are fictitious.

## Fee review report

An agent prepares a fee review: it collects data, compares validators, drafts the report with visible sub-steps, checks the numbers, and asks before sending. Use **Run simulation** to watch the connector draw itself from step to step; the last step waits for a simulated approval. This is a local animation. No agent runs and nothing is sent.

<WorkflowProgress theme="lumen" />

## How to use it

Use workflow progress when a run has ordered stages and a user benefits from seeing work advance: agent runs, ingestion pipelines, review checklists. For free-form branching, use the [node flow builder](/node-flow) instead.

1. **One node per stage.** Pending stages are hollow, the active stage pulses, completed stages fill with a check, and a stage that needs a person shows a lock with an "Asks first" chip.
2. **Draw the path, do not march it.** The connector is drawn progressively toward the active step, so the line itself communicates progress.
3. **Show sub-steps under the active stage.** Fine-grained work ("Writing validator section") belongs nested, with its own working state.
4. **Say the state in text.** Durations, the working label and the status line carry the same information as color and motion.
5. **Honor reduced motion.** With reduced motion, the line fills instantly and nothing pulses or shimmers; states still change.
