# Documentation

## Status card

Add a **Status card** from the dashboard editor to summarize a group of Home Assistant entities.

- Set a title and an optional Iconify icon.
- Select entities individually or enter an entity-ID wildcard such as `binary_sensor.door_*`.
- Set one or more comma-separated active states. The default is `on`; use values such as `open` or `wet` where appropriate.
- Optionally set the label shown after the active/total count, such as `on` or `open`. The localized “Active” label is used when this is blank.
- The card shows the active count, total count, and unavailable count. Missing, `unknown`, and `unavailable` entities are counted as unavailable and are never counted as active.
- Select the card outside edit mode to open a detail view listing the matched entities and their current states.

The card reads Home Assistant's live entity states directly and does not require a helper or template sensor.
