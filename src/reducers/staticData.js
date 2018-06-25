

const staticData = (state = {
  countries:   [
      {
          "id": 1,
          "name": "Sri Lanka",
          "region": 1
      },
      {
          "id": 2,
          "name": "Guatemala",
          "region": 1
      },
      {
          "id": 3,
          "name": "Ethiopia",
          "region": 1
      },
      {
          "id": 4,
          "name": "Iraq",
          "region": 1
      },
      {
          "id": 5,
          "name": "Malta",
          "region": 2
      },
      {
          "id": 6,
          "name": "Niger",
          "region": 2
      },
      {
          "id": 7,
          "name": "Guinea",
          "region": 2
      },
      {
          "id": 8,
          "name": "Chad",
          "region": 2
      },
      {
          "id": 9,
          "name": "Venezuela",
          "region": 2
      },
      {
          "id": 10,
          "name": "Turks and Caicos Islands",
          "region": 3
      },
      {
          "id": 11,
          "name": "South Africa",
          "region": 3
      },
      {
          "id": 12,
          "name": "Antarctica (the territory South of 60 deg S)",
          "region": 3
      },
      {
          "id": 13,
          "name": "Grenada",
          "region": 3
      },
      {
          "id": 14,
          "name": "British Virgin Islands",
          "region": 3
      }
  ],
  teams: [
      {
          "id": 1,
          "name": "Re-engineered attitude-oriented knowledgebase",
          "country": 1
      },
      {
          "id": 2,
          "name": "Stand-alone user-facing paradigm",
          "country": 1
      },
      {
          "id": 3,
          "name": "Open-architected zero tolerance application",
          "country": 1
      },
      {
          "id": 4,
          "name": "Open-source bottom-line monitoring",
          "country": 1
      },
      {
          "id": 5,
          "name": "Multi-lateral discrete Local Area Network",
          "country": 1
      },
      {
          "id": 6,
          "name": "Object-based holistic concept",
          "country": 1
      },
      {
          "id": 7,
          "name": "Grass-roots stable database",
          "country": 2
      },
      {
          "id": 8,
          "name": "Polarized discrete artificial intelligence",
          "country": 2
      },
      {
          "id": 9,
          "name": "Cloned foreground parallelism",
          "country": 2
      },
      {
          "id": 10,
          "name": "Balanced 3rdgeneration toolset",
          "country": 2
      },
      {
          "id": 11,
          "name": "De-engineered bottom-line framework",
          "country": 2
      },
      {
          "id": 12,
          "name": "Multi-tiered background support",
          "country": 2
      },
      {
          "id": 13,
          "name": "Advanced uniform superstructure",
          "country": 3
      },
      {
          "id": 14,
          "name": "Polarized fresh-thinking open architecture",
          "country": 3
      },
      {
          "id": 15,
          "name": "Multi-channeled explicit model",
          "country": 3
      },
      {
          "id": 16,
          "name": "Organic context-sensitive core",
          "country": 3
      },
      {
          "id": 17,
          "name": "User-centric solution-oriented leverage",
          "country": 3
      },
      {
          "id": 18,
          "name": "Enhanced multi-state ability",
          "country": 3
      },
      {
          "id": 19,
          "name": "Function-based systematic definition",
          "country": 4
      },
      {
          "id": 20,
          "name": "Automated clear-thinking parallelism",
          "country": 4
      },
      {
          "id": 21,
          "name": "Intuitive encompassing Internet solution",
          "country": 4
      },
      {
          "id": 22,
          "name": "De-engineered static process improvement",
          "country": 4
      },
      {
          "id": 23,
          "name": "Multi-tiered homogeneous concept",
          "country": 4
      },
      {
          "id": 24,
          "name": "User-centric homogeneous open architecture",
          "country": 4
      },
      {
          "id": 25,
          "name": "Proactive reciprocal open architecture",
          "country": 3
      },
      {
          "id": 26,
          "name": "Open-architected cohesive core",
          "country": 3
      },
      {
          "id": 27,
          "name": "Down-sized asymmetric challenge",
          "country": 3
      },
      {
          "id": 28,
          "name": "Total static system engine",
          "country": 3
      },
      {
          "id": 29,
          "name": "User-friendly multi-tasking intranet",
          "country": 3
      },
      {
          "id": 30,
          "name": "Fully-configurable system-worthy knowledge user",
          "country": 3
      },
      {
          "id": 31,
          "name": "Proactive asynchronous instruction set",
          "country": 5
      },
      {
          "id": 32,
          "name": "Object-based upward-trending database",
          "country": 5
      },
      {
          "id": 33,
          "name": "Operative leadingedge open architecture",
          "country": 5
      },
      {
          "id": 34,
          "name": "Optimized national concept",
          "country": 5
      },
      {
          "id": 35,
          "name": "Reverse-engineered context-sensitive installation",
          "country": 5
      },
      {
          "id": 36,
          "name": "Synergized human-resource circuit",
          "country": 5
      },
      {
          "id": 37,
          "name": "Horizontal high-level time-frame",
          "country": 6
      },
      {
          "id": 38,
          "name": "Optimized analyzing hierarchy",
          "country": 6
      },
      {
          "id": 39,
          "name": "Enhanced optimizing protocol",
          "country": 6
      },
      {
          "id": 40,
          "name": "Enhanced intermediate website",
          "country": 6
      },
      {
          "id": 41,
          "name": "User-centric bandwidth-monitored Graphical User Interface",
          "country": 6
      },
      {
          "id": 42,
          "name": "Customizable 24/7 productivity",
          "country": 6
      },
      {
          "id": 43,
          "name": "Seamless 4thgeneration solution",
          "country": 7
      },
      {
          "id": 44,
          "name": "Diverse actuating protocol",
          "country": 7
      },
      {
          "id": 45,
          "name": "Public-key mission-critical throughput",
          "country": 7
      },
      {
          "id": 46,
          "name": "Open-source multimedia firmware",
          "country": 7
      },
      {
          "id": 47,
          "name": "Ameliorated impactful project",
          "country": 7
      },
      {
          "id": 48,
          "name": "Front-line stable Internet solution",
          "country": 7
      },
      {
          "id": 49,
          "name": "Realigned contextually-based intranet",
          "country": 8
      },
      {
          "id": 50,
          "name": "Cross-platform national Internet solution",
          "country": 8
      },
      {
          "id": 51,
          "name": "Horizontal zero administration implementation",
          "country": 8
      },
      {
          "id": 52,
          "name": "Quality-focused human-resource implementation",
          "country": 8
      },
      {
          "id": 53,
          "name": "Virtual static approach",
          "country": 8
      },
      {
          "id": 54,
          "name": "Organized national encoding",
          "country": 8
      },
      {
          "id": 55,
          "name": "Public-key static alliance",
          "country": 9
      },
      {
          "id": 56,
          "name": "Ameliorated demand-driven service-desk",
          "country": 9
      },
      {
          "id": 57,
          "name": "Open-architected systemic instruction set",
          "country": 9
      },
      {
          "id": 58,
          "name": "Down-sized coherent framework",
          "country": 9
      },
      {
          "id": 59,
          "name": "Extended transitional superstructure",
          "country": 9
      },
      {
          "id": 60,
          "name": "Cross-group explicit framework",
          "country": 9
      },
      {
          "id": 61,
          "name": "Self-enabling executive core",
          "country": 10
      },
      {
          "id": 62,
          "name": "Persevering well-modulated Graphic Interface",
          "country": 10
      },
      {
          "id": 63,
          "name": "Customizable holistic concept",
          "country": 10
      },
      {
          "id": 64,
          "name": "Visionary didactic functionalities",
          "country": 10
      },
      {
          "id": 65,
          "name": "Centralized even-keeled secured line",
          "country": 10
      },
      {
          "id": 66,
          "name": "Enterprise-wide multi-state website",
          "country": 10
      },
      {
          "id": 67,
          "name": "Centralized static architecture",
          "country": 11
      },
      {
          "id": 68,
          "name": "Extended real-time architecture",
          "country": 11
      },
      {
          "id": 69,
          "name": "Enterprise-wide maximized budgetary management",
          "country": 11
      },
      {
          "id": 70,
          "name": "Balanced maximized system engine",
          "country": 11
      },
      {
          "id": 71,
          "name": "Down-sized high-level ability",
          "country": 11
      },
      {
          "id": 72,
          "name": "Front-line 6thgeneration focus group",
          "country": 11
      },
      {
          "id": 73,
          "name": "Face-to-face dedicated extranet",
          "country": 12
      },
      {
          "id": 74,
          "name": "Intuitive mobile instruction set",
          "country": 12
      },
      {
          "id": 75,
          "name": "Pre-emptive upward-trending interface",
          "country": 12
      },
      {
          "id": 76,
          "name": "Synergistic value-added database",
          "country": 12
      },
      {
          "id": 77,
          "name": "Phased system-worthy leverage",
          "country": 12
      },
      {
          "id": 78,
          "name": "Reactive client-server orchestration",
          "country": 12
      },
      {
          "id": 79,
          "name": "Polarized client-server customer loyalty",
          "country": 13
      },
      {
          "id": 80,
          "name": "Cloned explicit model",
          "country": 13
      },
      {
          "id": 81,
          "name": "Face-to-face multi-state functionalities",
          "country": 13
      },
      {
          "id": 82,
          "name": "Vision-oriented content-based open architecture",
          "country": 13
      },
      {
          "id": 83,
          "name": "Adaptive systematic instruction set",
          "country": 13
      },
      {
          "id": 84,
          "name": "Expanded 24/7 parallelism",
          "country": 13
      },
      {
          "id": 85,
          "name": "Visionary demand-driven infrastructure",
          "country": 14
      },
      {
          "id": 86,
          "name": "Universal 24/7 firmware",
          "country": 14
      },
      {
          "id": 87,
          "name": "Devolved context-sensitive synergy",
          "country": 14
      },
      {
          "id": 88,
          "name": "Horizontal dynamic leverage",
          "country": 14
      },
      {
          "id": 89,
          "name": "Virtual empowering strategy",
          "country": 14
      },
      {
          "id": 90,
          "name": "Exclusive attitude-oriented firmware",
          "country": 14
      }
  ],
  users: [
      {
          "username": "daniel",
          "first_name": "",
          "last_name": "",
          "email": "",
          "is_staff": true,
          "date_joined": "2018-06-21T13:44:07.875201Z",
          "version": 1529587701191233,
          "last_modify_date": "2018-06-21T13:44:07.876071Z",
          "teams": []
      }
  ],
  weapons: [
      {
          "id": 2,
          "name": "Explosive Device"
      },
      {
          "id": 1,
          "name": "Firearms"
      },
      {
          "id": 3,
          "name": "Knives"
      },
      {
          "id": 4,
          "name": "Other"
      }
  ],
  criticalities: [
      {
          "id": 4,
          "name": "Critical",
          "description": "Fatality, over $5000 damages"
      },
      {
          "id": 1,
          "name": "Minor",
          "description": "No injuries, less than $500 damage"
      },
      {
          "id": 2,
          "name": "Moderate",
          "description": "Non-hospital injuries, $500 - $1000 damages"
      },
      {
          "id": 3,
          "name": "Serious",
          "description": "Hospital injuries, $1000 - $5000 damages"
      }
  ],
  vehicleTypes: [
      {
          "id": 2,
          "name": "Partner"
      },
      {
          "id": 6,
          "name": "Private"
      },
      {
          "id": 5,
          "name": "Public Transport"
      },
      {
          "id": 1,
          "name": "Rental"
      },
      {
          "id": 4,
          "name": "UN"
      },
      {
          "id": 3,
          "name": "UNICEF"
      }
  ],
  crashTypes: [
      {
          "id": 3,
          "name": "Cyclist",
          "description": "subcategorized to motorcycle, bicycle"
      },
      {
          "id": 4,
          "name": "Lost Control",
          "description": "blown tire, loss of grip, oversteering"
      },
      {
          "id": 5,
          "name": "Other",
          "description": "textbox"
      },
      {
          "id": 2,
          "name": "Pedestrian",
          "description": "subcategorized to child, adult, animal"
      },
      {
          "id": 1,
          "name": "Vehicle",
          "description": "subcategorized to head-on, side, rear"
      }
  ],
  impacts: [
      {
          "id": 2,
          "name": "Fatalities"
      },
      {
          "id": 1,
          "name": "Injuries"
      },
      {
          "id": 3,
          "name": "Transactional Cost"
      }
  ],
  factors: [
      {
          "id": 2,
          "name": "Fatigue"
      },
      {
          "id": 1,
          "name": "Over-speeding"
      },
      {
          "id": 3,
          "name": "Tires"
      }
  ],
  propertyCategories: [],
  incidentTypes: [
      {
          "id": 2,
          "name": "Other"
      },
      {
          "id": 1,
          "name": "Road Traffic Accidents"
      }
  ]
}, action) => {
  return state;
}

export default staticData;
