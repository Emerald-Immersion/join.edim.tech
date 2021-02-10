# PlanetSide 2 API

## REST

### Alert Status

Use: &after=000000000&before=000000000

https://census.daybreakgames.com/get/ps2:v2/world_event/?type=METAGAME&world_id=10&c:limit=100
```json
{"world_event_list":[{"metagame_event_id":"176","metagame_event_state":"138","faction_nc":"33.3333320617700011","faction_tr":"2.35294127464299985","faction_vs":"7.05882358550999989","experience_bonus":"25","timestamp":"1611528247","zone_id":"0","world_id":"10","event_type":"MetagameEvent","table_type":"metagame_event","instance_id":"25225","metagame_event_state_name":"ended"},{"metagame_event_id":"149","metagame_event_state":"135","faction_nc":"43.9215698242200006","faction_tr":"39.2156867981000019","faction_vs":"16.0784320831300001","experience_bonus":"25","timestamp":"1611526686","zone_id":"0","world_id":"10","event_type":"MetagameEvent","table_type":"metagame_event","instance_id":"25226","metagame_event_state_name":"started"},{"metagame_event_id":"176","metagame_event_state":"135","faction_nc":"38.0392150878899997","faction_tr":"38.0392150878899997","faction_vs":"23.5294113159200009","experience_bonus":"25","timestamp":"1611525546","zone_id":"0","world_id":"10","event_type":"MetagameEvent","table_type":"metagame_event","instance_id":"25225","metagame_event_state_name":"started"}]}
```

World Names
https://census.daybreakgames.com/get/ps2:v2/world/?c:limit=10

Zone Names
https://census.daybreakgames.com/get/ps2:v2/zone/?c:limit=10

Metagame Event Names
https://census.daybreakgames.com/get/ps2:v2/metagame_event?c:limit=100&c:show=metagame_event_id,name.en

Facility Types
https://census.daybreakgames.com/get/ps2:v2/facility_type?c:limit=20

Facility Definitions
https://census.daybreakgames.com/get/ps2:v2/map_region/?c:limit=1000

Zone with Facilities
```
https://census.daybreakgames.com/get/ps2:v2/zone?c:tree=start:regions^list:1&c:join=map_region^list:1^inject_at:regions^hide:zone_id&c:limit=100
```


## Websocket

### Facility control and alerts
Subscribe

```json
{"service":"event","action":"subscribe","worlds":["10"],"eventNames":["FacilityControl","MetagameEvent"]}
```

Example (PlayerFacilityDefend)
```json
{
    "payload": {
        "duration_held": "870",
        "event_name": "FacilityControl",
        "facility_id": "300030",
        "new_faction_id": "2",
        "old_faction_id": "2",
        "outfit_id": "0",
        "timestamp": "1611533078",
        "world_id": "10",
        "zone_id": "4"
    },
    "service": "event",
    "type": "serviceMessage"
}
```

Example (PlayerFacilityCapture)
```json
{
    "payload": {
        "duration_held": "906",
        "event_name": "FacilityControl",
        "facility_id": "287060",
        "new_faction_id": "1",
        "old_faction_id": "3",
        "outfit_id": "37511594860086186",
        "timestamp": "1611533115",
        "world_id": "10",
        "zone_id": "4"
    },
    "service": "event",
    "type": "serviceMessage"
}
```

Filter
```javascript

// crown facility_id: 6200
// edim outfit_id: 37511594860086186

// add facility_id to watch list for next capture or continant lock

```


### Axil Points
Subscribe
```json
{"service":"event","action":"subscribe","characters":["5428059164954198113"],"eventNames":["Death"]}
```

Example
```json
{
	"payload":{
		"attacker_character_id":"5428059164954198113",
		"attacker_fire_mode_id":"26103",
		"attacker_loadout_id":"15",
		"attacker_vehicle_id":"0",
		"attacker_weapon_id":"26003",
		"character_id":"5428059164954198113",
		"character_loadout_id":"6",
		"event_name":"Death",
		"is_headshot":"1",
		"timestamp":"1611533078",
		"vehicle_id":"0",
		"world_id":"1",
		"zone_id":"2"
	},
	"service":"event",
	"type":"serviceMessage"
}
```

### Ragequit Detection
Subscribe
```json
{"service":"event","action":"subscribe","characters":["5428059164954198113"],"eventNames":["Death"]}
```

Query either every several seconds for a minute or just after a minute, after a Kill event from the web socket.
```
https://census.daybreakgames.com/get/ps2:v2/characters_online_status/?character_id=5428059164954198113
```

Or watch all logouts against list, timeout to remove item from list
```json
{"service":"event","action":"subscribe","worlds":["10"],"eventNames":["PlayerLogout"]}
```


```json
{"payload":{"character_id":"5429038329410828849","event_name":"PlayerLogin","timestamp":"1611720644","world_id":"1"},"service":"event","type":"serviceMessage"}
{"payload":{"character_id":"5429091716534991393","event_name":"PlayerLogout","timestamp":"1611720653","world_id":"1"},"service":"event","type":"serviceMessage"}
```


### Outfit monitoring


Watch all login/logouts
```json
{"service":"event","action":"subscribe","worlds":["10"],"eventNames":["PlayerLogin","PlayerLogout"]}
```

Either for single players.

Set of players.

Number of players of rank(s).