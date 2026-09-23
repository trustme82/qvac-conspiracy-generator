Pick a mundane object — the office stapler, garden gnomes, vending machines — and an on-device AI reveals an obviously absurd, clearly fictional "conspiracy theory" about it, purely for laughs. Entirely on your machine with Tether's QVAC SDK. No cloud call, no API key, no bill. 100% satire.

It calls the QVAC SDK's `loadModel()`, `unloadModel()`, and `completion()` functions directly. The topic is deliberately not a free-text field — it's restricted to a fixed list of ten silly, harmless objects, both in the UI dropdown and re-validated server-side.

## What it does

```bash
npm run gui
