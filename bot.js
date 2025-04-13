// === ITEMS ===
const items = {
  "sword_paper": { name: "Paper Sword", type: "weapon", level: 1, atk: 6 },
  "sword_iron": { name: "Iron Sword", type: "weapon", level: 2, atk: 18 },
  "iron_armor": { name: "Iron Armor", type: "armor", level: 1, atk: 8, hp: 30, crt: 2 },
  "ring_speed": { name: "Ring of Speed", type: "accessory", level: 1, atk: 1, hp: 10, crt: 4 },
  "small_potion_atk": { name: "Small ATK Potion", type: "consumable", level: 1, stat: "atk", amount: 1 },
  "small_potion_hp": { name: "Small HP Potion", type: "consumable", level: 1, stat: "hp", amount: 1 },
  "small_potion_crt": { name: "Small CRT Potion", type: "consumable", level: 1, stat: "crt", amount: 1 },
  "mega_potion_atk": { name: "Mega ATK Potion", type: "consumable", level: 5, stat: "atk", amount: 15 },
  "mega_potion_hp": { name: "Mega HP Potion", type: "consumable", level: 5, stat: "hp", amount: 15 },
  "mega_potion_crt": { name: "Mega CRT Potion", type: "consumable", level: 5, stat: "crt", amount: 15 }
};

// === ZONES ===
const zones = {
  "Plains": {
    levelReq: 1,
    maxLevel: 15,
    mobs: ["grass", "bear"],
    boss: "Mama"
  },
  "Desert": {
    levelReq: 7,
    maxLevel: 20,
    mobs: ["orc"],
    boss: "Mama"
  }
};

// === MOBS ===
const mobs = {
  "grass": {
    name: "Grass Monster", type: "normal", zone: "Plains", level: 1, health: 30, damage: 5, xp: 20, gold: 10,
    drops: [
      { item: "small_potion_atk", chance: 30 },
      { item: "small_potion_crt", chance: 20 }
    ]
  },
  "bear": {
    name: "Bear", type: "normal", zone: "Plains", level: 2, health: 50, damage: 6, xp: 40, gold: 20,
    drops: [
      { item: "small_potion_atk", chance: 60 },
      { item: "small_potion_crt", chance: 40 },
      { item: "sword_iron", chance: 60}
    ]
  },
  "Mama": {
    name: "Mama Bear", type: "boss", zone: "Plains", level: 3, health: 125, damage: 20, xp: 50, gold: 25,
    drops: [
      { item: "iron_armor", chance: 100 },
      { item: "mega_potion_atk", chance: 100 }
    ]
  },
  "orc": {
    name: "Orc", type: "normal", zone: "Desert", level: 6, health: 80, damage: 12, xp: 40, gold: 20,
    drops: [
      { item: "small_potion_hp", chance: 30 },
      { item: "small_potion_atk", chance: 20 }
    ]
  },
  "Mama": {
    name: "Mama Bear", type: "boss", zone: "Desert", level: 10, health: 150, damage: 20, xp: 100, gold: 50,
    drops: [
      { item: "ring_speed", chance: 100 },
      { item: "mega_potion_crt", chance: 100 }
    ]
  }
};

// === SHOP ===
const shop = {
  "mega_potion_hp": { price: 100, levelReq: 5 },
  "mega_potion_atk": { price: 100, levelReq: 5 },
  "mega_potion_crt": { price: 100, levelReq: 5 },
  "iron_armor": { price: 150, levelReq: 3 }
};

// === SKILLS ===
const skills = {
  cyclone: {
    name: "Cyclone",
    level: 5,
    type: "attack",
    cooldown: 3,
    takesTurn: true,
    use: (atk) => {
      const dmg = Math.floor(atk * 5);
      return { message: `You used Cyclone for ${dmg} damage!`, damage: dmg };
    }
  },
  lure_jab: {
    name: "Lure Jab",
    level: 10,
    type: "attack",
    cooldown: 3,
    takesTurn: true,
    use: (atk) => {
      const dmg = Math.floor(atk * 1.1);
      return { message: `You used Lure Jab for ${dmg} damage!\nThe enemy is vulnerable!`, damage: dmg, appliesVuln: true };
    }
  }
}

// === PLAYER ===
let player = {
  name: "Hero",
  level: 1,
  xp: 0,
  gold: 0,
  baseStats: { atk: 0, hp: 100, crt: 0 },
  currentHP: 100,
  inventory: { "sword_paper": 1, "small_potion_atk": 2 },
  equipment: { weapon: "sword_paper", armor: null, accessory: null },
  skills: [null, null, null],
  skillCooldowns: [0, 0, 0]
};

// === CORE FUNCTIONS ===
function xpToNextLevel(level) {
  return Math.floor(25 * Math.pow(1.25, level - 1));
}

function getEquippedStat(stat) {
  let total = 0;
  for (let slot of ["weapon", "armor", "accessory"]) {
    let id = player.equipment[slot];
    if (id) total += items[id][stat] || 0;
  }
  return total;
}

const statCaps = {
  atk: 1000,
  hp: 1100,
  crt: 100
};

function getTotalStat(stat) {
  const base = player.baseStats[stat] || 0;
  const gear = getEquippedStat(stat);
  const max = statCaps[stat] ?? Infinity;
  return Math.min(base + gear, max);
}

function gainXP(amount) {
  player.xp += amount;
  while (player.xp >= xpToNextLevel(player.level)) {
    player.xp -= xpToNextLevel(player.level);
    player.level++;
    alert(`You leveled up to level ${player.level}!`);
  }
}

function chooseZone() {
  const zoneNames = Object.keys(zones);
  let menu = zoneNames.map((z, i) => `${i + 1}. ${z} (Lvl ${zones[z].levelReq}-${zones[z].maxLevel})`).join("\n");
  const input = prompt(`-- Choose Zone --\n${menu}\nType back to return`);
  if (input === "back") return startMenu();

  const zone = zones[zoneNames[parseInt(input) - 1]];
  if (!zone) return chooseZone();
  if (player.level < zone.levelReq) {
    alert("Level too low.");
    return chooseZone();
  }

  zoneMenu(zoneNames[parseInt(input) - 1]);
}

function zoneMenu(zoneName) {
  const zone = zones[zoneName];
  const subChoice = prompt(`-- ${zoneName} --
1 - Fight Mob
2 - Fight Boss
3 - Inventory
4 - Equip Skills
5 - Back`);

  if (subChoice === "1") {
    const mobId = zone.mobs[Math.floor(Math.random() * zone.mobs.length)];
    startBattle(JSON.parse(JSON.stringify(mobs[mobId])), zoneName);
  } else if (subChoice === "2") {
    startBattle(JSON.parse(JSON.stringify(mobs[zone.boss])), zoneName);
  } else if (subChoice === "3") {
    openInventory(() => zoneMenu(zoneName));
  } else if (subChoice === "4") {
    openSkillMenu(() => zoneMenu(zoneName));
  } else {
    chooseZone();
  }
}

function openInventory(callback = startMenu) {
  const entries = Object.entries(player.inventory);
  if (entries.length === 0) {
    alert("Inventory is empty.");
    return callback();
  }

  const list = entries.map(([id, count], i) => `${i + 1}. ${items[id].name} x${count}`).join("\n");
  const choice = prompt(`-- Inventory --\n${list}\nChoose item or type back`);
  if (choice === "back") return callback();

  const index = parseInt(choice) - 1;
  const [itemId] = entries[index];
  const item = items[itemId];

  if (player.level < item.level) {
    alert(`Level ${item.level} required.`);
    return openInventory(callback);
  }

  if (item.type === "consumable") {
    let count = prompt(`Use how many? You have ${player.inventory[itemId]}`);
    let useCount = Math.min(parseInt(count), player.inventory[itemId]);
    if (!useCount) return openInventory(callback);

    let stat = item.stat;
    let max = stat === "crt" ? 100 : 1000;
    let added = 0;

    for (let i = 0; i < useCount; i++) {
      if (player.baseStats[stat] < max) {
        player.baseStats[stat] += item.amount;
        player.inventory[itemId]--;
        added += item.amount;
        if (player.inventory[itemId] <= 0) delete player.inventory[itemId];
      }
    }
    alert(`Increased ${stat.toUpperCase()} by ${added}`);
  } else {
    player.equipment[item.type] = itemId;
    alert(`Equipped ${item.name} as ${item.type}`);
  }

  openInventory(callback);
}

function getLoot(mob, zoneName) {
  let lootText = `Gained ${mob.xp} XP and ${mob.gold} Gold!\n`;
  gainXP(mob.xp);
  player.gold += mob.gold;

  if (player.level > zones[mob.zone].maxLevel) {
    lootText += "(Too high level, no drops)\n";
  } else {
    for (const drop of mob.drops) {
      if (Math.random() * 100 < drop.chance) {
        if (!player.inventory[drop.item]) player.inventory[drop.item] = 0;
        if (player.inventory[drop.item] < 99) {
          player.inventory[drop.item]++;
          lootText += `- ${items[drop.item].name}\n`;
        } else {
          lootText += `- ${items[drop.item].name} (max)\n`;
        }
      }
    }
  }
  alert(lootText || "No loot.");
  zoneMenu(zoneName);
}

function startBattle(mob, zoneName) {
  let mobHP = mob.health;
  player.currentHP = getTotalStat("hp");
  let vuln = 0;

  function showSkills() {
    let unlocked = player.skills.map((id, i) => {
      if (!id) return `${i + 1}. [Empty]`;
      const skill = skills[id];
      return `${i + 1}. ${skill.name} (CD: ${player.skillCooldowns[i]})`;
    }).join("\n");
    return prompt(`-- Use Skill --\n${unlocked}\nType back`);
  }

  function turn() {
  if (mobHP <= 0) {
    alert(`Defeated ${mob.name}!`);
    return getLoot(mob, zoneName);
  }

  if (player.currentHP <= 0) {
    alert("You died.");
    return startMenu();
  }

  const action = prompt(`-- Battle --
${mob.name}: ${mobHP} HP
You: ${player.currentHP} HP

1 - Attack
2 - Use Skill
3 - Run`);

  if (action === "1") {
    let atk = getTotalStat("atk");
    if (vuln > 0) atk = Math.floor(atk * 1.5);
    const crt = getTotalStat("crt");
    const crit = Math.random() * 100 < crt * 0.5;
    const dmg = crit ? atk * 3 : atk;
    mobHP -= dmg;
    const taken = mob.damage;
    player.currentHP -= taken;

    alert(`You ${crit ? "CRITICALLY " : ""}hit for ${dmg} damage.
${mob.name} did ${taken} damage to you.
${mob.name} now has ${mobHP} HP left`);
  } else if (action === "2") {
    const s = showSkills();
    if (s === "back") return turn();
    const idx = parseInt(s) - 1;
    const skillId = player.skills[idx];
    const skill = skills[skillId];

    if (!skill || player.level < skill.level || player.skillCooldowns[idx] > 0) {
      alert("Can't use that.");
      return turn();
    }

    const result = skill.use(getTotalStat("atk"));
    mobHP -= result.damage;
    let taken = 0;

    if (skillId === "lure_jab") vuln = 3;

    player.skillCooldowns[idx] = skill.cooldown;
    if (skill.takesTurn) {
      taken = mob.damage;
      player.currentHP -= taken;
    }

    alert(`${result.message}
${mob.name} did ${taken} damage to you.
${mob.name} now has ${mobHP} HP left`);
  } else if (action === "3") {
    if (mob.type === "raid") {
      alert("You can't flee this battle!");
      return turn();
    } else {
      alert("You fled.");
      return zoneMenu(zoneName);
    }
  }

  player.skillCooldowns = player.skillCooldowns.map(cd => cd > 0 ? cd - 1 : 0);
  if (vuln > 0) vuln--;
  turn();
}
turn();
}

function startMenu() {
  const choice = prompt(`-- Main Menu --
1 - Enter Zone
2 - Inventory
3 - View Profile
4 - Shop
5 - Skills
6 - Quit`);

  if (choice === "1") chooseZone();
  else if (choice === "2") openInventory();
  else if (choice === "3") viewProfile();
  else if (choice === "4") openShop();
  else if (choice === "5") openSkillMenu();
  else if (choice === "6") alert("Goodbye!");
  else startMenu();
}

function viewProfile() {
  alert(`-- ${player.name} --
Level: ${player.level}
XP: ${player.xp}/${xpToNextLevel(player.level)}
Gold: ${player.gold}
HP: ${getTotalStat("hp")}
ATK: ${getTotalStat("atk")}
CRT: ${getTotalStat("crt")} (${getTotalStat("crt") * 0.5}%)
Skills: ${player.skills.map(s => s ? skills[s].name : "[Empty]").join(", ")}
Equipped:
- Weapon: ${items[player.equipment.weapon]?.name || "None"}
- Armor: ${items[player.equipment.armor]?.name || "None"}
- Accessory: ${items[player.equipment.accessory]?.name || "None"}`);
  startMenu();
}

function openShop() {
  const list = Object.entries(shop)
    .map(([id, data], i) => `${i + 1}. ${items[id].name} - ${data.price}G (Lvl ${data.levelReq})`)
    .join("\n");
  const input = prompt(`-- Shop --\n${list}\nGold: ${player.gold}\nChoose item or type back`);
  if (input === "back") return startMenu();

  const index = parseInt(input) - 1;
  const itemId = Object.keys(shop)[index];
  const { price, levelReq } = shop[itemId];

  if (player.level < levelReq) {
    alert("Level too low.");
  } else if (player.gold < price) {
    alert("Not enough gold.");
  } else {
    player.gold -= price;
    if (!player.inventory[itemId]) player.inventory[itemId] = 0;
    player.inventory[itemId]++;
    alert(`Bought ${items[itemId].name}`);
  }

  openShop();
}

function openSkillMenu(callback = startMenu) {
  const type = prompt("Choose skill type:\n1. Attack\n2. Support\nType back");
  if (type === "back") return callback();

  const skillList = Object.entries(skills)
    .filter(([id, s]) => (type === "1" && s.type === "attack") || (type === "2" && s.type === "support"))
    .map(([id, s], i) => `${i + 1}. ${s.name} (Lvl ${s.level})`)
    .join("\n");

  const slotChoice = prompt(`Choose slot (1–3):`);
  const idx = parseInt(slotChoice) - 1;
  if (player.level < [1, 20, 120][idx]) {
    alert("Slot locked.");
    return callback();
  }

  const skillInput = prompt(`-- Skills --\n${skillList}\nChoose skill`);
  const list = Object.entries(skills).filter(([id, s]) =>
    (type === "1" && s.type === "attack") || (type === "2" && s.type === "support"));
  const skillId = list[parseInt(skillInput) - 1]?.[0];
  const skill = skills[skillId];

  if (!skill || player.level < skill.level) {
    alert("Can't equip this skill yet.");
    return callback();
  }

  player.skills[idx] = skillId;
  player.skillCooldowns[idx] = 0;
  alert(`Equipped ${skill.name} in Slot ${idx + 1}`);
  callback();

}
// Start the game
startMenu()
