import { describe, it } from 'node:test';
import { strictEqual, deepStrictEqual, ok } from 'node:assert';

import { Team, parse } from '..';

const EVENT_DATE = '10/20/2020 - 10:30:50';
const eventDate = new Date(EVENT_DATE.replace(' - ', ' '));

const getEventString = (event: string): string => (
	`${EVENT_DATE}: ${event}`
);

const unknownTeam = {
	id: Team.UNKNOWN,
	name: Team[Team.UNKNOWN]
};

const terroristTeam = {
	id: Team.TERRORISTS,
	name: Team[Team.TERRORISTS]
};

const counterTerroristTeam = {
	id: Team.COUNTER_TERRORISTS,
	name: Team[Team.COUNTER_TERRORISTS]
};

describe('Parsers', (): void => {
	describe('parser', (): void => {
		it('should correctly parse "receivedAt"', (): void => {
			const logs = [
				getEventString('"ConnectionPlayer<93><STEAM_1:0:12345><>" connected, address ""'),
				getEventString('"AttackerName<93><STEAM_1:0:12345><CT>" [698 2222 -69] killed "Lester<97><BOT><TERRORIST>" [1303 2143 64] with "hkp2000" (headshot)')
			];

			for (const log of logs) {
				const result = parse(log);

				ok(result !== undefined, `Failed parse log: ${log}`);

				ok(result.receivedAt instanceof Date);
				strictEqual(result.receivedAt.getTime(), eventDate.getTime());
			}
		});

		it('should correctly parse entities', (): void => {
			const events: [string, Record<string, unknown>][] = [
				['"PlayerName<93><STEAM_1:0:12345><CT>" [-1117 2465 -72] committed suicide with "world"', {
					player: {
						kind: 'player',

						entityId: 93,
						steamId: 'STEAM_1:0:12345',

						name: 'PlayerName',

						position: [-1117, 2465, -72],

						team: counterTerroristTeam,
					},
					how: 'world',

				}],
				['"BotName<93><BOT><CT>" [-1117 2465 -72] committed suicide with "world"', {
					player: {
						kind: 'bot',

						entityId: 93,

						name: 'BotName',

						position: [-1117, 2465, -72],

						team: counterTerroristTeam
					},
					how: 'world',

				}],
				['"Console<><Console><>" [-1117 2465 -72] committed suicide with "world"', {
					player: {
						kind: 'console',

						position: [-1117, 2465, -72],
					},
					how: 'world',
				}],
				['"chicken<93>" [-1117 2465 -72] committed suicide with "world"', {
					player: {
						kind: 'chicken',
						entityId: 93,

						position: [-1117, 2465, -72],
					},
					how: 'world',

				}]
			];

			for (const [log, event] of events) {
				const result = parse(getEventString(log));

				ok(result !== undefined, `Failed parse log: ${log}`);

				strictEqual(result.type, 'suicide');
				deepStrictEqual(result.payload, event);
			}
		});
	});

	describe('connection', (): void => {
		it('should correctly parse sub-event "connected"', () => {
			const log = getEventString('"ConnectionPlayer<93><STEAM_1:0:12345><>" connected, address ""');

			const result = parse(log);

			ok(result !== undefined, `Failed parse log: ${log}`);

			strictEqual(result.type, 'connection');
			deepStrictEqual(result.payload, {
				kind: 'connected',
				player: {
					kind: 'player',

					entityId: 93,
					steamId: 'STEAM_1:0:12345',

					name: 'ConnectionPlayer',

					team: unknownTeam
				},
				address: '',
				reason: undefined
			});
		});

		it('should correctly parse sub-event "entered"', () => {
			const log = getEventString('"ConnectionPlayer<93><STEAM_1:0:12345><>" entered the game');

			const result = parse(log);

			ok(result !== undefined, `Failed parse log: ${log}`);

			strictEqual(result.type, 'connection');
			deepStrictEqual(result.payload, {
				kind: 'entered',
				player: {
					kind: 'player',

					entityId: 93,
					steamId: 'STEAM_1:0:12345',

					name: 'ConnectionPlayer',

					team: unknownTeam
				},
				address: undefined,
				reason: undefined
			});
		});

		it('should correctly parse sub-event "disconnected"', () => {
			const log = getEventString('"ConnectionPlayer<93><STEAM_1:0:12345><>" disconnected (reason "Server shutting down")');

			const result = parse(log);

			ok(result !== undefined, `Failed parse log: ${log}`);

			strictEqual(result.type, 'connection');
			deepStrictEqual(result.payload, {
				kind: 'disconnected',
				player: {
					kind: 'player',

					entityId: 93,
					steamId: 'STEAM_1:0:12345',

					name: 'ConnectionPlayer',

					team: unknownTeam
				},
				address: undefined,
				reason: 'Server shutting down'
			});
		});
	});

	describe('killed', (): void => {
		it('should correctly parse', () => {
			const log = getEventString('"AttackerName<93><STEAM_1:0:12345><CT>" [698 2222 -69] killed "VictimName<94><STEAM_1:0:12345><TERRORIST>" [1303 2143 64] with "hkp2000" (throughsmoke headshot)');

			const result = parse(log);

			ok(result !== undefined, `Failed parse log: ${log}`);

			strictEqual(result.type, 'killed');
			deepStrictEqual(result.payload, {
				attacker: {
					kind: 'player',

					entityId: 93,
					steamId: 'STEAM_1:0:12345',

					name: 'AttackerName',

					position: [698, 2222, -69],

					team: counterTerroristTeam
				},
				victim: {
					kind: 'player',

					entityId: 94,
					steamId: 'STEAM_1:0:12345',

					name: 'VictimName',

					position: [1303, 2143, 64],

					team: terroristTeam
				},
				weaponName: 'hkp2000',
				modifiers: ['throughsmoke', 'headshot']
			});
		});
	});

	describe('assist', (): void => {
		it('should correctly parse', () => {
			const log = getEventString('"AssitantName<93><STEAM_1:0:12345><CT>" assisted killing "VictimName<92><STEAM_1:0:12345><TERRORIST>"');

			const result = parse(log);

			ok(result !== undefined, `Failed parse log: ${log}`);

			strictEqual(result.type, 'assist');
			deepStrictEqual(result.payload, {
				assistant: {
					kind: 'player',

					entityId: 93,
					steamId: 'STEAM_1:0:12345',

					name: 'AssitantName',

					team: counterTerroristTeam
				},
				victim: {
					kind: 'player',

					entityId: 92,
					steamId: 'STEAM_1:0:12345',

					name: 'VictimName',

					team: terroristTeam
				}
			});
		});
	});

	describe('attacked', (): void => {
		it('should correctly parse', () => {
			const log = getEventString('"AttackerName<93><STEAM_1:0:12345><CT>" [820 2225 -34] attacked "VictimName<94><STEAM_1:0:12345><TERRORIST>" [1001 2164 0] with "ak47" (damage "34") (damage_armor "4") (health "29") (armor "95") (hitgroup "stomach")');

			const result = parse(log);

			ok(result !== undefined, `Failed parse log: ${log}`);

			strictEqual(result.type, 'attacked');
			deepStrictEqual(result.payload, {
				attacker: {
					kind: 'player',

					entityId: 93,
					steamId: 'STEAM_1:0:12345',

					name: 'AttackerName',

					position: [820, 2225, -34],

					team: counterTerroristTeam
				},
				victim: {
					kind: 'player',

					entityId: 94,
					steamId: 'STEAM_1:0:12345',

					name: 'VictimName',

					position: [1001, 2164, 0],

					team: terroristTeam
				},

				weaponName: 'ak47',

				damageAmount: 34,
				damageArmourAmount: 4,

				remainingHealth: 29,
				remainingArmour: 95,

				hitGroup: 'stomach'
			});
		});
	});

	describe('player_update', (): void => {
		it('should correctly parse', () => {
			const log = getEventString('"OldName<93><STEAM_1:0:12345><CT>" changed name to "NewName"');

			const result = parse(log);

			ok(result !== undefined, `Failed parse log: ${log}`);

			strictEqual(result.type, 'player_update');
			deepStrictEqual(result.payload, {
				kind: 'change_name',
				player: {
					kind: 'player',

					entityId: 93,
					steamId: 'STEAM_1:0:12345',

					name: 'OldName',

					team: counterTerroristTeam
				},
				newName: 'NewName'
			});
		});
	});

	describe('projectile_spawned', (): void => {
		it('should correctly parse', () => {
			const log = getEventString('Molotov projectile spawned at 470.226189 1001.444831 746.135715, velocity 225.051541 140.823573 -358.102564');

			const result = parse(log);

			ok(result !== undefined, `Failed parse log: ${log}`);

			strictEqual(result.type, 'projectile_spawned');
			deepStrictEqual(result.payload, {
				item: 'molotov',
				position: [470.226189, 1001.444831, 746.135715],
				velocity: [225.051541, 140.823573, -358.102564]
			});
		});
	});

	describe('entity_triggered', (): void => {
		it('should correctly parse', () => {
			const player = {
				kind: 'player',

				entityId: 93,
				steamId: 'STEAM_1:0:12345',

				name: 'PlayerName',

				team: counterTerroristTeam
			};

			const world = {
				kind: 'world'
			};

			const events: [string, Record<string, unknown>][] = [
				['World triggered "Game_Commencing"', {
					entity: world,
					kind: 'game_commencing',
					value: undefined
				}],
				['World triggered "Match_Start" on "de_inferno"', {
					entity: world,
					kind: 'match_start',
					value: 'de_inferno'
				}],
				['World triggered "Round_Start"', {
					entity: world,
					kind: 'round_start',
					value: undefined
				}],
				['World triggered "Round_End"', {
					entity: world,
					kind: 'round_end',
					value: undefined
				}],
				['World triggered "Restart_Round_(1_second)"', {
					entity: world,
					kind: 'restart_round_(1_second)',
					value: undefined
				}],
				['World triggered "Restart_Round_(3_seconds)"', {
					entity: world,
					kind: 'restart_round_(3_seconds)',
					value: undefined
				}],
				['"PlayerName<93><STEAM_1:0:12345><CT>" triggered "Begin_Bomb_Defuse_With_Kit"', {
					entity: player,
					kind: 'begin_bomb_defuse_with_kit',
					value: undefined
				}],
				['"PlayerName<93><STEAM_1:0:12345><CT>" triggered "Begin_Bomb_Defuse_Without_Kit"', {
					entity: player,
					kind: 'begin_bomb_defuse_without_kit',
					value: undefined
				}],
				['"PlayerName<93><STEAM_1:0:12345><CT>" triggered "Defused_The_Bomb"', {
					entity: player,
					kind: 'defused_the_bomb',
					value: undefined
				}],
				['"PlayerName<93><STEAM_1:0:12345><CT>" triggered "Planted_The_Bomb"', {
					entity: player,
					kind: 'planted_the_bomb',
					value: undefined
				}],
				['"PlayerName<93><STEAM_1:0:12345><CT>" triggered "Got_The_Bomb"', {
					entity: player,
					kind: 'got_the_bomb',
					value: undefined
				}],
				['"PlayerName<93><STEAM_1:0:12345><CT>" triggered "Dropped_The_Bomb"', {
					entity: player,
					kind: 'dropped_the_bomb',
					value: undefined
				}],
				['"PlayerName<93><STEAM_1:0:12345><CT>" triggered "clantag" (value "123")', {
					entity: player,
					kind: 'clantag',
					value: '123'
				}]
			];

			for (const [log, event] of events) {
				const result = parse(getEventString(log));

				ok(result !== undefined, `Failed parse log: ${log}`);

				strictEqual(result.type, 'entity_triggered');
				deepStrictEqual(result.payload, event);
			}
		});
	});

	describe('purchased', (): void => {
		it('should correctly parse', () => {
			const log = getEventString('"PlayerName<93><STEAM_1:0:12345><CT>" purchased "aug"');

			const result = parse(log);

			ok(result !== undefined, `Failed parse log: ${log}`);

			strictEqual(result.type, 'purchased');
			deepStrictEqual(result.payload, {
				player: {
					kind: 'player',

					entityId: 93,
					steamId: 'STEAM_1:0:12345',

					name: 'PlayerName',

					team: counterTerroristTeam
				},
				weaponName: 'aug'
			});
		});
	});

	describe('rcon', (): void => {
		it('should correctly parse', () => {
			const log = getEventString('rcon from "127.0.0.1:49987": command "say hello"');

			const result = parse(log);

			ok(result !== undefined, `Failed parse log: ${log}`);

			strictEqual(result.type, 'rcon');
			deepStrictEqual(result.payload, {
				address: '127.0.0.1:49987',
				command: 'say hello'
			});
		});
	});

	describe('say', (): void => {
		it('should correctly parse', () => {
			const player = {
				kind: 'player',

				entityId: 93,
				steamId: 'STEAM_1:0:12345',

				name: 'PlayerName',

				team: counterTerroristTeam
			};

			const events: [string, Record<string, unknown>][] = [
				['"PlayerName<93><STEAM_1:0:12345><CT>" say "hello"', {
					player,
					to: 'global',
					message: 'hello'
				}],
				['"PlayerName<93><STEAM_1:0:12345><CT>" say_team "hello"', {
					player,
					to: 'team',
					message: 'hello'
				}]
			];

			for (const [log, event] of events) {
				const result = parse(getEventString(log));

				ok(result !== undefined, `Failed parse log: ${log}`);

				strictEqual(result.type, 'say');
				deepStrictEqual(result.payload, event);
			}
		});
	});

	describe('server_cvar', (): void => {
		it('should correctly parse', () => {
			const events: [string, Record<string, unknown>][] = [
				['"mp_fraglimit" = "0"', {
					name: 'mp_fraglimit',
					value: '0'
				}],
				['server_cvar: "sv_cheats" "1"', {
					name: 'sv_cheats',
					value: '1'
				}]
			];

			for (const [log, event] of events) {
				const result = parse(getEventString(log));

				ok(result !== undefined, `Failed parse log: ${log}`);

				strictEqual(result.type, 'server_cvar');
				deepStrictEqual(result.payload, event);
			}
		});
	});

	describe('server_log', (): void => {
		it('should correctly parse', () => {
			const events: [string, Record<string, unknown>][] = [
				[String.raw`Log file started (file "logs\L172_028_192_001_27015_202009211728_000.log") (game "C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo") (version "7929")`, {
					kind: 'log_file',
					state: 'started',
					filePath: String.raw`logs\L172_028_192_001_27015_202009211728_000.log`,
					gamePath: String.raw`C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\csgo`,
					version: '7929'
				}],
				['Log file closed', {
					kind: 'log_file',
					state: 'closed',
					filePath: undefined,
					gamePath: undefined,
					version: undefined,
				}],
				['Loading map "de_inferno"', {
					kind: 'map',
					state: 'loading',
					map: 'de_inferno',
					crc: undefined
				}],
				['Started map "de_inferno" (CRC "-896074606")', {
					kind: 'map',
					state: 'started',
					map: 'de_inferno',
					crc: '-896074606'
				}],
				['server_message: "quit"', {
					kind: 'message',
					message: 'quit'
				}],
				['server_message: "restart"', {
					kind: 'message',
					message: 'restart'
				}]
			];

			for (const [log, event] of events) {
				const result = parse(getEventString(log));

				ok(result !== undefined, `Failed parse log: ${log}`);

				strictEqual(result.type, 'server_log');
				deepStrictEqual(result.payload, event);
			}
		});
	});

	describe('suicide', (): void => {
		it('should correctly parse', () => {
			const player = {
				kind: 'player',

				entityId: 93,
				steamId: 'STEAM_1:0:12345',

				name: 'PlayerName',

				position: [-1117, 2465, -72],

				team: counterTerroristTeam
			};

			const events: [string, Record<string, unknown>][] = [
				['"PlayerName<93><STEAM_1:0:12345><CT>" [-1117 2465 -72] committed suicide with "world"', {
					player,
					how: 'world'
				}],
				['"PlayerName<93><STEAM_1:0:12345><CT>" [-1117 2465 -72] committed suicide with "hegrenade"', {
					player,
					how: 'hegrenade'
				}],
				['"PlayerName<93><STEAM_1:0:12345><CT>" [-1117 2465 -72] committed suicide with "inferno"', {
					player,
					how: 'inferno'
				}]
			];

			for (const [log, event] of events) {
				const result = parse(getEventString(log));

				ok(result !== undefined, `Failed parse log: ${log}`);

				strictEqual(result.type, 'suicide');
				deepStrictEqual(result.payload, event);
			}
		});
	});

	describe('switched_team', (): void => {
		it('should correctly parse', () => {
			const log = getEventString('"PlayerName<93><STEAM_1:0:12345>" switched from team <TERRORIST> to <CT>');

			const result = parse(log);

			ok(result !== undefined, `Failed parse log: ${log}`);

			strictEqual(result.type, 'switched_team');
			deepStrictEqual(result.payload, {
				player: {
					kind: 'player',

					entityId: 93,
					steamId: 'STEAM_1:0:12345',

					name: 'PlayerName',

					team: unknownTeam
				},

				fromTeam: terroristTeam,
				toTeam: counterTerroristTeam
			});
		});
	});

	describe('team_name', (): void => {
		it('should correctly parse', () => {
			const log = getEventString('Team playing "CT": Test');

			const result = parse(log);

			ok(result !== undefined, `Failed parse log: ${log}`);

			strictEqual(result.type, 'team_name');
			deepStrictEqual(result.payload, {
				team: counterTerroristTeam,

				name: 'Test'
			});
		});
	});

	describe('team_triggered', (): void => {
		it('should correctly parse', () => {
			const events: [string, Record<string, unknown>][] = [
				['Team "TERRORIST" triggered "SFUI_Notice_Terrorists_Win" (CT "7") (T "3")', {
					kind: 'sfui_notice_terrorists_win',

					team: terroristTeam,

					counterTerroristScore: 7,
					terroristScore: 3
				}],
				['Team "CT" triggered "SFUI_Notice_CTs_Win" (CT "7") (T "3")', {
					kind: 'sfui_notice_cts_win',

					team: counterTerroristTeam,

					counterTerroristScore: 7,
					terroristScore: 3
				}],
				['Team "CT" triggered "SFUI_Notice_Target_Bombed" (CT "7") (T "3")', {
					kind: 'sfui_notice_target_bombed',

					team: counterTerroristTeam,

					counterTerroristScore: 7,
					terroristScore: 3
				}],
				['Team "CT" triggered "SFUI_Notice_Target_Saved" (CT "7") (T "3")', {
					kind: 'sfui_notice_target_saved',

					team: counterTerroristTeam,

					counterTerroristScore: 7,
					terroristScore: 3
				}],
				['Team "CT" triggered "SFUI_Notice_Bomb_Defused" (CT "7") (T "3")', {
					kind: 'sfui_notice_bomb_defused',

					team: counterTerroristTeam,

					counterTerroristScore: 7,
					terroristScore: 3
				}]
			];

			for (const [log, event] of events) {
				const result = parse(getEventString(log));

				ok(result !== undefined, `Failed parse log: ${log}`);

				strictEqual(result.type, 'team_triggered');
				deepStrictEqual(result.payload, event);
			}
		});
	});

	describe('threw', (): void => {
		it('should correctly parse', () => {
			const log = getEventString('"PlayerName<93><STEAM_1:0:12345><CT>" threw molotov [-2035 1521 35]');

			const result = parse(log);

			ok(result !== undefined, `Failed parse log: ${log}`);

			strictEqual(result.type, 'threw');
			deepStrictEqual(result.payload, {
				player: {
					kind: 'player',

					entityId: 93,
					steamId: 'STEAM_1:0:12345',

					name: 'PlayerName',

					position: [-2035, 1521, 35],

					team: counterTerroristTeam
				},

				item: 'molotov'
			});
		});
	});

	describe('validated', (): void => {
		it('should correctly parse', () => {
			const events: [string, Record<string, unknown>][] = [
				['"PlayerName<93><STEAM_1:0:12345><>" STEAM USERID validated', {
					kind: 'valid',

					player: {
						kind: 'player',

						entityId: 93,
						steamId: 'STEAM_1:0:12345',

						name: 'PlayerName',

						team: unknownTeam
					}
				}],
				['STEAMAUTH: Client PlayerName received failure code 6', {
					kind: 'failed',

					player: {
						name: 'PlayerName'
					},

					code: 6
				}]
			];

			for (const [log, event] of events) {
				const result = parse(getEventString(log));

				ok(result !== undefined, `Failed parse log: ${log}`);

				strictEqual(result.type, 'validated');
				deepStrictEqual(result.payload, event);
			}
		});
	});

	describe('warmod', (): void => {
		it('should correctly parse', () => {
			const log = getEventString('[WarMod_BFG] {"event":"test"}');

			const result = parse(log);

			ok(result !== undefined, `Failed parse log: ${log}`);

			strictEqual(result.type, 'warmod');
			deepStrictEqual(result.payload, {
				event: 'test'
			});
		});
	});
});
