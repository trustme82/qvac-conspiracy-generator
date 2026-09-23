Pick a mundane object — the office stapler, garden gnomes, vending machines — and an on-device AI reveals an obviously absurd, clearly fictional "conspiracy theory" about it, purely for laughs. Entirely on your machine with [Tether's QVAC SDK](https://github.com/tether/qvac). No cloud call, no API key, no bill. **100% satire — see the safety note below.**

It calls the QVAC SDK's `loadModel()`, `unloadModel()`, and `completion()` functions directly. The topic is **deliberately not a free-text field** — it's restricted to a fixed list of ten silly, harmless objects, both in the UI dropdown and re-validated server-side, so the app has no way to be pointed at a real-world sensitive topic (politics, health, tragedies, real people). The system prompt additionally instructs the model to keep every theory impossible-sounding and free of real references. A deterministic "absurdity meter" scores the output from playful keyword presence — flavor only.

## What it does

```bash
npm run gui
