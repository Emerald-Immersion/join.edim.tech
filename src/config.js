var config = {
    "ranks": {
        'Lieutenant Required': {
            'Medic': [
                { 'id': 1630, 'name': 'Medical Applicator 6' },
                { 'id': 8886, 'name': 'Nano-Regen Device 6' },
                { 'id': 8130, 'name': 'Combat Medic Flak Armour 5' },
                { 'id': 884, 'name': 'Nanite Revive Grenade' },
            ],
            'Engineer': [
                { 'id': 8125, 'name': 'Engineer Flak Armour 5' },
                { 'id': 6010, 'name': 'Nano-Armor Kit 6 (VS)' },
                { 'id': 1278, 'name': 'Ammunition Package 6' },
                { 'id': 6004531, 'name': 'Reserve Hardlight Barrier' },
            ],
            'Heavy': [
                { 'id': 7697, 'name': 'Heavy Assault Flak Armour 5' },
                { 'id': 101, 'name': 'Medical Kits (x4)', 'stack_count': 4 },
                { 'id': 8823, 'name': 'Adrenaline Shield 5' },
                { 'id': 1096, 'name': 'Concussion Grenades' },
            ],
            'MAX': [
                { 'id': 6002683, 'name': 'MAX Emergency Repair 6' },
                { 'id': 14115, 'name': 'MAX Ordnance Armor 5' },
                // 17000 is the LH quasar, 17012 is RH Quasar, 17030 is RH Blueshift, 17024 is RH Nebula, 7520 and 17025 are Cosmos
                { 'id': [17012, 17030, 17024, 7520, 17025], 'name': 'Any right hand Anti-Infantry Max Arm (excl Gorgons)' },
                // 17001 is RH Comet. 17013 is LH Comet. 16032 is Vortex
                { 'id': [17013, 16032], 'name': 'Any left hand Anti-Vehicle Max Arm (excl Gorgons)' },
                // 17004 is RH burster
                { 'id': 17016, 'name': 'Left hand burster' },
            ],
            'Sunderer': [
                { 'id': 3006, 'name': 'Sunderer Fire Suppression 4' },
                // Sunderer GSD 2,3,4
                { 'id': [2847, 2848, 2849], 'name': 'Sunderer Gate Shield Diffuser 2 (or higher)' },
                { 'id': 5923, 'name': 'Deployment Shield 4' },
                { 'id': 3046, 'name': 'Sunderer Racer High Speed Chasis 3' },
            ],
            'Lightning': [
                { 'id': 3116, 'name': 'Lightning Fire Suppression 4' },
                { 'id': 6003651, 'name': 'Lightning Flanker Armour 4 (not needed for Axil2, according to Axil2)' },
                { 'id': [3103, 6005070], 'name': 'Lightning AP Cannon (L100 Python AP or Halloween Variant)' },
            ],
            'Galaxy': [
                { 'id': 5532, 'name': 'Galaxy Fire Suppression 4' },
                { 'id': 5736, 'name': 'Galaxy Nanite Proximity Repair System 6' },
                { 'id': 5687, 'name': 'Galaxy High-G Airframe 3' },
                { 'id': 5514, 'name': 'Galaxy M60-A Bulldog (Left)' },
                { 'id': 5515, 'name': 'Galaxy M60-A Bulldog (Right)' },
                { 'id': 5512, 'name': 'Galaxy Walker (Top)' },
                { 'id': 5513, 'name': 'Galaxy Walker (Tail)' },
            ],
            'Valkyrie': [
                { 'id': 6584, 'name': 'Valkyrie Vehicle Stealth 4' },
                { 'id': 6595, 'name': 'Valkyrie Hover Stability Airframe 3' },
            ]
        },
        "Lieutenant Recommended": {
            'Infiltrator': [
                { "id": 472, "name": "Recon Detection Device 1" },
                { "id": 50051, "name": "EMP Grenade" },
                { "id": 1045, "name": "Proximity Mine" },
            ],
            'Light Assault': [
                { "id": 432, "name": "C-4 (check)" },
                { "id": 8629, "name": "Drifter Jump Jets 1" },
                { "id": 2308, "name": "Hunter QCX" },
                { "id": 1709, "name": "Explosive Bolt" },
            ],
            'Combat Medic': [
                { "id": 0, "name": "Grenade Bandolier 3" },
                { "id": 0, "name": "Nano-Regen Device 6" },
                { "id": 0, "name": "C-4" },
                { "id": 0, "name": "Flak Armor 5" },
            ],
            'Engineer': [
                { "id": 202, "name": "Anti-Infantry MANA Turret" },
                { "id": 0, "name": "Tank Mine" },
            ],
            'Heavy Assault': [
                { "id": 0, "name": "Lasher X2" },
                { "id": 0, "name": "Concussion Grenade" },
                { "id": 0, "name": "Grenade Bandolier 3" },
                { "id": 0, "name": "C-4" },
                { "id": 0, "name": "Flak Armor 5" },
            ],
            'MAX': [
                { "id": 0, "name": "NS-10 Burster" }
            ],
            'Harasser': [
                { "id": 3441, "name": "E540 Halberd" },
                { "id": 0, "name": "Fire Suppression 1" },
                { "id": 0, "name": "Vehicle Stealth 1" },
                { "id": 0, "name": "Racer High Speed Chassis 1" },
            ],
            'Deployment Sunderer': [
                { "id": 3086, "name": "Primary G40-F Ranger" },
                { "id": 3089, "name": "Secondary G40-F Ranger" },
                { "id": 3003, "name": "Fire suppression 1" },
                { "id": 3098, "name": "Deployment Shield" },
                { "id": 802791, "name": "Stealth Cloaking Module" },
                { "id": 3056, "name": "Racer High Speed Chassis 1" },
            ],
            'GateShield Diffuser Sunderer': [
                { "id": 2800, "name": "Primary M12 Kobalt" },
                { "id": 2806, "name": "Secondary M12 Kobalt" },
                { "id": 2846, "name": "Gate Shield Diffuser 1" },
                { "id": 2964, "name": "Nanite Proximity Repair System" },
                { "id": 3056, "name": "Racer High Speed Chassis 1" },
            ],
            'Battle Bus Sunderer': [
                { "id": 2803, "name": "Primary M20 Basilisk" },
                { "id": 2809, "name": "Secondary M20 Basilisk" },
                { "id": 3003, "name": "Fire suppression 1" },
                { "id": 2964, "name": "Nanite Proximity Repair System" },
                { "id": 3007, "name": "Blockade Armor 1" },
                { "id": 3056, "name": "Racer High Speed Chassis 1" },
            ],
            'Valkyrie': [
                { "id": 6553, "name": "CAS 14-E" },
                { "id": 6577, "name": "Scout Radar 1 (check)" },
                { "id": 6581, "name": "Vehicle Stealth 1 (check)" },
                { "id": 6590, "name": "Evasiveness Airframe 1" },
            ],
            'Galaxy': [
                { "id": 5513, "name": "Top: A30 Walker" },
                { "id": 5513, "name": "Tail: A30 Walker" },
                { "id": 2832, "name": "Left: M60-G Bulldog (check)" },
                { "id": 2832, "name": "Right: M60-G Bulldog (check)" },
                { "id": 5529, "name": "Fire suppression 1" },
                { "id": 5731, "name": "Nanite Proximity Repair System 1" },
                { "id": 5275, "name": "Vehicle Stealth 1 (check)" },
                { "id": 5694, "name": "Racer High Speed Airframe 1" },
            ]
        }
    },
    "particles": '{"particles":{"number":{"value":80,"density":{"enable":true,"value_area":800}},"color":{"value":"#00A9A3"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":5,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":150,"color":"#00A9A3","opacity":0.4,"width":1},"move":{"enable":true,"speed":6,"direction":"none","random":false,"straight":false,"out_mode":"out","attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"repulse"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":50},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true,"config_demo":{"hide_card":false,"background_color":"#b61924","background_image":"","background_position":"50% 50%","background_repeat":"no-repeat","background_size":"cover"}}'
};
