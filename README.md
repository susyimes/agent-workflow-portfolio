# Agent Workflow Portfolio

Static GitHub Pages site for presenting AI Agent workflow practice, Android-first Agent experiments, and selected interaction screenshots.

## Update Screenshots

1. Put desensitized images into `assets/screenshots/`.
2. Add or edit an entry in `data/diary.json`.
3. Keep each screenshot tied to one concrete point:
   - scenario
   - goal
   - Agent action
   - human judgment
   - result
   - boundary or lesson

## Diary Entry Format

```json
{
  "id": "2026-05-10-example",
  "date": "2026-05-10",
  "title": "多 Agent 协作工作流复盘",
  "type": "workflow",
  "tags": ["Codex", "Harness", "Review"],
  "summary": "这一天验证了一个多 Agent 拆解、执行、复核的工作流。",
  "notes": [
    "场景：需要处理一个复杂项目任务。",
    "Agent 行为：拆解任务、读取代码、产出补丁。",
    "人的判断：确认边界、复核风险、决定是否合并。"
  ],
  "screenshots": [
    {
      "src": "assets/screenshots/example.png",
      "caption": "脱敏后的任务编排截图"
    }
  ]
}
```

## Local Preview

Use a tiny local server so `diary.html` can load `data/diary.json`:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.
