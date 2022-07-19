import { BSON } from 'realm-web';
import { geoJSONPolygon } from './../../../components/map/mapTypes';
import { disasterTypes } from './../../../components/map/mapTypes';

enum RiskLevel {
  'ONE' = '1-Minimal',
  'TWO' = '2-Low',
  'THREE' = '3-Moderate',
  'FOUR' = '4-Substantial',
  'FIVE' = '5-High',
}

enum SecurityLevel {
  'ZERO' = '0-Work',
  'ONE' = '1-Monitoring',
  'TWO' = '2-Hibernation',
  'THREE' = '3-Relocation',
  'FOUR' = '4-Evacuation',
}

enum SecurityCategory {
  'GENERAL' = 'General',
  'INCIDENT' = 'Incident',
  'ARMEDGROUPS' = 'Armed groups',
  'SENSITIVITIES' = 'Sensitivities',
  'NATURALHAZARDS' = 'Natural hazards',
  'CRIME' = 'Crime',
  'HAZMAT' = 'Hazmat',
  'PERSONNEL' = 'Personnel',
  'OTHER' = 'Other',
}

enum ConditionsCategory {
  'TEMPERATURE' = 'Temperature',
  'WIND' = 'Wind',
  'RAINFALL' = 'Rainfall',
  'EXTREME' = 'Extreme',
  'ALERT' = 'Alert',
}

export type MissionSchema = {
  _id: BSON.ObjectId;
  timestamp: string;
  identifier: string;
  estimatedPopulation: number;
  nuts: string;
  mission_leader: BSON.ObjectId;
  start_of_mission: string;
  end_of_mission: string;
  participants: BSON.ObjectId[];
  operating_teams: BSON.ObjectId[];
  geoJSON: geoJSONPolygon;
  disasterType: disasterTypes[];
  roleAndMandates: string[];
  objectives: string[];
  nationalAssetsDeployed: boolean;
  internationalAssetsDeployed: boolean;
  CIMICDeployed: boolean;
  threatsAndRisks: string[];
  riskLevel: RiskLevel;
  securityLevel: SecurityLevel;
  securityReport: [
    { reported_from: BSON.ObjectId },
    { situation: string },
    { securityCategory: SecurityCategory },
    { timestamp: string }
  ];
  weatherReport: [
    { reported_from: BSON.ObjectId },
    { conditions: string },
    { conditionsCategory: ConditionsCategory },
    { timestamp: string }
  ];
  evacuationRoute: string;
  additionalEvacuationSignal: string;
  safeHaven: string;
  nextHospital: string;
  nextVeterinary: string;
};

export type CreateMissionArgs = {
  //   _id: BSON.ObjectId;
  //   timestamp: string;
  identifier: string;
  estimatedPopulation: number;
  //   nuts: string;
  mission_leader: BSON.ObjectId;
  start_of_mission: string;
  end_of_mission: string;
  participants: BSON.ObjectId[];
  //   operating_teams: BSON.ObjectId[];
  geoJSON: geoJSONPolygon;
  disasterType: disasterTypes[];
  //   roleAndMandates: string[];
  objectives: string[];
  //   nationalAssetsDeployed: boolean;
  //   internationalAssetsDeployed: boolean;
  //   CIMICDeployed: boolean;
  //   threatsAndRisks: string[];
  riskLevel: RiskLevel;
  securityLevel: SecurityLevel;
  //   securityReport: [
  // { reported_from: BSON.ObjectId },
  // { situation: string },
  // { securityCategory: SecurityCategory },
  // { timestamp: string }
  //   ];
  //   weatherReport: [
  //     { reported_from: BSON.ObjectId },
  //     { conditions: string },
  //     { conditionsCategory: ConditionsCategory },
  //     { timestamp: string }
  //   ];
  //   evacuationRoute: string;
  //   additionalEvacuationSignal: string;
  //   safeHaven: string;
  //   nextHospital: string;
  //   nextVeterinary: string;
};
