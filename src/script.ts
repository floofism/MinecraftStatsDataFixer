function start() {
    const dropdown = document.querySelectorAll(".dropdown");

    dropdown.forEach((fix) => {
        fix.addEventListener("click", (e) => {ToggleDropdown(fix, !fix.parentElement!.children[1].checkVisibility())});
        ToggleDropdown(fix, !fix.checkVisibility());
    });
}

function ToggleDropdown(Dropdown: Element, Visibility: Boolean) {
    // Header text toggle
    let HeaderText: HTMLElement = Dropdown.parentElement!.children[0] as HTMLElement;
    if(Visibility)
    {
        HeaderText.innerHTML = HeaderText.innerHTML.substring(5, HeaderText.innerHTML.length);
        HeaderText.style.textDecoration = "underline";
        HeaderText.style.marginTop = "15px";
    }
    else
    {
        HeaderText.innerHTML = "> " + HeaderText.innerHTML;
        HeaderText.style.textDecoration = "none";
        HeaderText.style.marginTop = "7px";
    }

    // Toggles visibility of all elements inside the container
    for(let i = 1; i < Dropdown.parentElement!.children.length; i++)
    {
        let element = Dropdown.parentElement!.children[i] as HTMLElement;
        element.style.display = Visibility ? "" : "none";
    }
}

let OverrideVis: Boolean = false;
function ToggleAll() {
    OverrideVis = ! OverrideVis;

    document.getElementById("openAll")!.setAttribute("src", "Explain_" + (OverrideVis ? "on" : "off") + ".png");
    document.getElementById("openAll")!.setAttribute("title", (OverrideVis ? "Close" : "Open") + " All Explanations");
    
    const dropdown = document.querySelectorAll(".dropdown");
    dropdown.forEach((fix) => {
        if(OverrideVis != fix.parentElement!.children[1].checkVisibility())
        {
            ToggleDropdown(fix, OverrideVis);
        }
    });
}

let TargetVer: number;
let statFileName: string;

async function filePreview() {
    
    let previewFile: string = await LoadFile();

    document.getElementById("filePreviewName")!.innerText = statFileName;

    let previewJSON = JSON.parse(previewFile);
    previewJSON = JSON.stringify(previewJSON, null, 2);

    var Preview = document.getElementById("filePreview")!
    Preview.innerHTML = previewJSON.toString();
    Preview.style.maxHeight = "400px";
    Preview.style.width = "500px";
    Preview.style.overflowY = "scroll";
    Preview.style.overflowX = "auto";
}

async function LoadFile() {
    TargetVer = (document.getElementById("targetVer") as HTMLSelectElement).selectedIndex;

    var files = (document.getElementById("fileInput") as HTMLInputElement).files;

    if(files != null && files.length)
    {
        var loadedFile = files[0];

        statFileName = loadedFile.name;

        if(loadedFile) return await loadedFile.text();
    }

    console.error("No file!")
    return "";
}

function Save(statFile: string) {
    var blob = new Blob([statFile], {type: "application/json"});
    var url = URL.createObjectURL(blob);

    var element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', statFileName);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}

async function DataFixerUpper()
{
    let statFile: string = await LoadFile()
    let VerIndex: number = TargetVer + 1;

    if(VerIndex > 0) // 13w37a - 1.7.10/14w05b numeric
    {
        // Unlit torch into a lit torch
        statFile = statFile.replaceAll("stat.useItem.75", "stat.useItem.76")
        statFile = statFile.replaceAll("stat.craftItem.75", "stat.craftItem.76")
    }

    if(VerIndex > 1) // 14w06a+ (Namespace)
    {
        // Some 1.8 IDs due to the namespace IDs not happening till 14w05b
        // as well as IDs being insane in the 150 - 180 range
        let BlockNamespace: string[] = ["air",
            "stone", "grass", "dirt", "cobblestone",
            "planks", "sapling", "bedrock", "flowing_water",
            "water", "flowing_lava", "lava", "sand", "gravel",
            "gold_ore", "iron_ore", "coal_ore", "log", "leaves",
            "sponge", "glass","lapis_ore", "lapis_block", "dispenser",
            "sandstone", "noteblock", "bed", "golden_rail", 
            "detector_rail", "sticky_piston", "web", 
            "tallgrass", "deadbush", "piston", "piston_head",
            "wool", "piston_extension", "yellow_flower",
            "red_flower", "brown_mushroom", "red_mushroom",
            "gold_block", "iron_block", "double_stone_slab",
            "stone_slab", "brick_block", "tnt", "bookshelf",
            "mossy_cobblestone", "obsidian", "torch", "fire",
            "mob_spawner", "oak_stairs", "chest", "redstone_wire",
            "diamond_ore", "diamond_block", "crafting_table",
            "wheat", "farmland", "furnace", "lit_furnace",
            "standing_sign", "wooden_door", "ladder", "rail", 
            "stone_stairs", "wall_sign", "lever", 
            "stone_pressure_plate", "iron_door", 
            "wooden_pressure_plate", "redstone_ore", "lit_redstone_ore",
            "unlit_redstone_torch", "redstone_torch",
            "stone_button", "snow_layer", "ice", "snow",
            "cactus", "clay", "reeds", "jukebox", "fence",
            "pumpkin", "netherrack", "soul_sand", "glowstone",
            "portal", "lit_pumpkin", "cake", "unpowered_repeater",
            "powered_repeater", "stained_glass", "trapdoor",
            "monster_egg", "stonebrick", "brown_mushroom_block",
            "red_mushroom_block", "iron_bars", "glass_pane", 
            "melon_block", "pumpkin_stem", "melon_stem", "vine", 
            "fence_gate", "brick_stairs", "stone_brick_stairs", 
            "mycelium", "waterlily", "nether_brick", "nether_brick_stairs",
            "nether_wart", "enchanting_table", "brewing_stand",
            "cauldron", "end_portal", "end_portal_frame",
            "end_stone", "dragon_egg", "redstone_lamp",
            "redstone_lamp", "lit_redstone_lamp",
            "double_wooden_slab", "wooden_slab", "cocoa",
            "sandstone_stairs", "emerald_ore", "ender_chest",
            "tripwire_hook", "tripwire", "emerald_block",
            "spruce_stairs", "birch_stairs", "jungle_stairs",
            "command_block", "beacon", "cobblestone_wall",
            "flower_pot", "carrots", "potatoes", "wooden_button",
            "skull", "anvil", "trapped_chest",
            "light_weighted_pressure_plate", "heavy_weighted_pressure_plate",
            "unpowered_comparator", "powered_comparator",
            "daylight_detector", "redstone_block", "quartz_ore",
            "hoppper", "quartz_block", "quartz_stairs", "activator_rail",
            "dropper", "stained_hardened_clay", "stained_glass_pane",
            "leaves2", "log2", "acacia_stairs", "dark_oak_stairs",
            "slime", "barrier", "iron_trapdoor", "prismarine",
            "sea_lantern", "hay_block", "carpet", "hardened_clay",
            "coal_block", "packed_ice", "double_plant", "standing_banner",
            "wall_banner", "daylight_detector_inverted"
        ];

        // Why is 1.6 items (416 (horse saddles into armour stands) to 421)
        // between 1.8 items and who do i need to explode for it
        let ItemNamespace: string[] = ["iron_shovel", "iron_pickaxe",
            "iron_axe", "flint_and_steel", "apple", "bow", "arrow",
            "coal", "diamond", "iron_ingot", "gold_ingot", "iron_sword",
            "wooden_sword", "wooden_shovel", "wooden_pickaxe", "wooden_axe",
            "stone_sword", "stone_shovel", "stone_pickaxe", "stone_axe",
            "diamond_sword", "diamond_shovel", "diamond_pickaxe",
            "diamond_axe", "stick", "bowl", "mushroom_stew", "golden_sword",
            "golden_shovel", "golden_pickaxe", "golden_axe", "string",
            "feather", "gunpowder", "wooden_hoe", "stone_hoe", "iron_hoe",
            "diamond_hoe", "golden_hoe", "wheat_seeds", "wheat", "bread",
            "leather_helmet", "leather_chestplate", "leather_leggings",
            "leather_boots", "chainmail_helmet", "chainmail_chestplate",
            "chainmail_leggings", "chainmail_boots", "iron_helmet",
            "iron_chestplate", "iron_leggings", "iron_boots", "diamond_helmet",
            "diamond_chestplate", "diamond_leggings", "diamond_boots",
            "golden_helmet", "golden_chestplate", "golden_leggings",
            "golden_boots", "flint", "porkchop", "cooked_porkchop", "painting",
            "golden_apple", "sign", "wooden_door", "bucket", "water_bucket",
            "lava_bucket", "minecart", "saddle", "iron_door", "redstone",
            "snowball", "boat", "leather", "milk_bucket", "brick", "clay_ball",
            "reeds", "paper", "book", "slime_ball", "chest_minecart",
            "furnace_minecart", "egg", "compass", "fishing_rod", "clock",
            "glowstone_dust", "fish", "cooked_fish", "dye", "bone",
            "sugar", "cake", "bed", "repeater", "cookie", "filled_map", "shears",
            "melon", "pumpkin_seeds", "melon_seeds", "beef", "cooked_beef",
            "chicken", "cooked_chicken", "rotten_flesh", "ender_pearl",
            "blaze_rod", "ghast_tear", "gold_nugget", "nether_wart",
            "potion", "glass_bottle", "spider_eye", "fermented_spider_eye",
            "blaze_powder", "magma_cream", "brewing_stand", "cauldron", 
            "ender_eye", "speckled_melon", "spawn_egg","experience_bottle", 
            "fire_charge", "writable_book", "written_book", "emerald", 
            "item_frame", "flower_pot", "carrot", "potato", "baked_potato", 
            "poisonous_potato", "map", "golden_carrot", "skull", "carrot_on_a_stick",
            "nether_star", "pumpkin_pie", "fireworks", "firework_charge",
            "enchanted_book", "comparator", "netherbrick", "quartz",
            "tnt_minecart", "hopper_minecart", "prismarine_shard",
            "prismarine_crystals", "rabbit", "cooked_rabbit", "rabbit_stew",
            "rabbit_foot", "rabbit_hide", "armor_stand", "iron_horse_armor",
            "golden_horse_armor", "diamond_horse_armor", "lead", "name_tag", 
            "command_block_minecart"
        ];

        let DiscNamespace: string[] = ["13", "cat", "blocks", "chirp",
            "far", "mall", "mellohi", "stal", "strad", "ward", "11", "wait"];

        // Numerical to Namespace
        // God awful way of doing this but idk how to read each entry
        for(let i = 2256 - 1; i < DiscNamespace.length + 2256 - 1; i++) // Music Discs
        {
            statFile = statFile.replaceAll("stat.useItem." + i, "stat.useItem.minecraft.record_" + DiscNamespace[i - 2256]);
            statFile = statFile.replaceAll("stat.breakItem." + i, "stat.breakItem.minecraft.record_" + DiscNamespace[i - 2256]);

            statFile = statFile.replaceAll("stat.mineBlock." + i, "stat.mineBlock.minecraft.record_" + DiscNamespace[i - 2256]);
            statFile = statFile.replaceAll("stat.craftItem." + i, "stat.craftItem.minecraft.record_" + DiscNamespace[i - 2256]);
        }

        for(let i = ItemNamespace.length + 256 - 1; i > 256 - 1; i--) // Items 
        {
            statFile = statFile.replaceAll("stat.useItem." + i, "stat.useItem.minecraft." + ItemNamespace[i - 256]);
            statFile = statFile.replaceAll("stat.breakItem." + i, "stat.breakItem.minecraft." + ItemNamespace[i - 256]);

            statFile = statFile.replaceAll("stat.mineBlock." + i, "stat.mineBlock.minecraft." + ItemNamespace[i - 256]);
            statFile = statFile.replaceAll("stat.craftItem." + i, "stat.craftItem.minecraft." + ItemNamespace[i - 256]);
        }

        for(let i = BlockNamespace.length - 1; i > 0 - 1; i--) // Blocks
        {
            statFile = statFile.replaceAll("stat.useItem." + i, "stat.useItem.minecraft." + BlockNamespace[i]);
            statFile = statFile.replaceAll("stat.breakItem." + i, "stat.breakItem.minecraft." + BlockNamespace[i]);

            statFile = statFile.replaceAll("stat.mineBlock." + i, "stat.mineBlock.minecraft." + BlockNamespace[i]);
            statFile = statFile.replaceAll("stat.craftItem." + i, "stat.craftItem.minecraft." + BlockNamespace[i]);
        }
    }
  
    let EntityLowerSnakecase: string[] = ["arrow", "bat", "boat", "blaze",
        "chicken", "cow", "creeper","enderman", "endermite", "fireball",
        "ghast", "item", "painting", "pig", "rabbit", "sheep", "shulker",
        "silverfish", "slime", "snowman", "snowball", "spider", "squid",
        "villager", "witch", "wolf", "xp_bottle", "egg", "ender_pearl",
        "falling_block", "fireworks_rocket", "magma_cube", "minecart",
        "chest_minecart", "commandblock_minecart", "furnace_minecart",
        "hopper_minecart", "spawner_minecart", "tnt_minecart", "mooshroom",
        "ocelot", "potion", "tnt", "wither", "zombie_pigman", "guardian",
        "horse", "skeleton", "zombie", "area_effect_cloud", "armor_stand",
        "cave_spider", "dragon_fireball", "ender_crystal", "ender_dragon",
        "xp_orb", "villager_golem", "item_frame", "leash_knot", "lightning_bolt",
        "polar_bear", "shulker_bullet", "small_fireball", "spectral_arrow",
        "wither_skull",
    ]

    // zombie pigman has pig lowercased as it gets converted earlier.
    let EntityUpperCamelCase: string[] = ["Arrow", "Bat", "Boat", "Blaze",
        "Chicken", "Cow", "Creeper", "Enderman", "Endermite", "Fireball",
        "Ghast", "Item", "Painting", "Pig", "Rabbit", "Sheep", "Shulker",
        "Silverfish", "Slime", "SnowMan", "Snowball", "Spider", "Squid",
        "Villager", "Witch", "Wolf", "ThrownExpBottle", "ThrownEgg", 
        "ThrownEnderpearl", "FallingSand", "FireworksRocketEntity", "LavaSlime",
        "MinecartRideable", "MinecartChest", "MinecartCommandBlock", 
        "MinecartFurnace", "MinecartHopper", "MinecartSpawner", "MinecartTNT",
        "MushroomCow", "Ozelot", "ThrownPotion", "PrimedTNT", "WitherBoss",
        "pigZombie", "Guardian", "EntityHorse", "Skeleton", "Zombie",
        "AreaEffectCloud", "ArmorStand", "CaveSpider", "DragonFireball",
        "EnderCrystal", "EnderDragon", "EyeOfEnderSignal", "XPOrb", "VillagerGolem",
        "ItemFrame", "LeashKnot", "LightningBolt", "PolarBear", "ShulkerBullet",
        "SmallFireball", "SpectralArrow", "WitherSkull"
    ];

    if(VerIndex > 2) // entity snakecase (16w32a to 16w35a)
    {
        for(let i = 0; i < EntityLowerSnakecase.length; i++)
        {
            statFile = statFile.replaceAll("stat.killEntity." + EntityUpperCamelCase[i], "stat.killEntity.minecraft:" + EntityLowerSnakecase[i]);
            statFile = statFile.replaceAll("stat.entityKilledBy." + EntityUpperCamelCase[i], "stat.entityKilledBy.minecraft:" + EntityLowerSnakecase[i]);
        }
    }

    if(VerIndex > 3) // entity camelcase (16w36a)
    {
        // Converts all the entities into the old format
        for(let i = 0; i < EntityLowerSnakecase.length; i++)
        { 
            statFile = statFile.replaceAll("stat.killEntity.minecraft:" + EntityLowerSnakecase[i], "stat.killEntity." + EntityUpperCamelCase[i]);
            statFile = statFile.replaceAll("stat.entityKilledBy.minecraft:" + EntityLowerSnakecase[i], "stat.entityKilledBy." + EntityUpperCamelCase[i]);
        }
        
        // horses (and skeletons and zombies) are split into separate entities but the horse specifically has a new name
        // so this fixed that in particular
        statFile = statFile.replaceAll("stat.killEntity.EntityHorse", "stat.killEntity.Horse");
        statFile = statFile.replaceAll("stat.entityKilledBy.EntityHorse", "stat.entityKilledBy.Horse");
    }

    if(VerIndex > 4 && VerIndex < 10) // shulker box ID changed to "purple" though in 18w10b they added a undyed version
    {
        statFile = statFile.replaceAll("minecraft.shulker_box", "minecraft.purple_shulker_box");
    }

    if(VerIndex > 5) // 1.11.1-pre - 17w46a
    {
        // new ID
        statFile = statFile.replaceAll("totem", "totem_of_undying")
    }

    // DataVersion was added in 17w47a meaning any file that includes it is already in the new format.
    if(VerIndex > 6 && !statFile.includes("DataVersion")) // Flattening rework (17w47a)
    {
        let GeneralStatLower: string[] = ["aviate_one_cm", "interact_with_beacon", "eat_cake_slice",
            "horse_one_cm", "pig_one_cm", "leave_game", "clean_banner", "swim_one_cm",
            "climb_one_cm", "open_enderchest", "inspect_hopper", "fill_cauldron",
            "trigger_trapped_chest", "interact_with_furnace", "talked_to_villager",
            "play_noteblock", "sprint_one_cm", "deaths" ,"drop", "fish_caught", 
            "walk_under_water_one_cm", "open_chest", "play_record", "jump", "fall_one_cm",
            "crouch_one_cm", "interact_with_crafting_table", "inspect_dropper", "boat_one_cm",
            "interact_with_brewingstand", "inspect_dispenser", "traded_with_villager",
            "tune_noteblock", "use_cauldron", "damage_dealt", "damage_taken", "sleep_in_bed", 
            "pot_flower", "walk_one_cm", "animals_bred", "player_kills", "minecart_one_cm", 
            "open_shulker_box", "enchant_item", "mob_kills", "sneak_time", "clean_armor", 
            "play_one_minute", "time_since_death", "fly_one_cm"]

        let GeneralStatUpper: string[] = ["aviateOneCm", "beaconInteraction", "cakeSlicesEaten",
            "horseOneCm", "pigOneCm", "leaveGame", "bannerCleaned", "swimOneCm",
            "climbOneCm", "enderchestOpened", "hopperInspected", "cauldronFilled",
            "trappedChestTriggered", "furnaceInteraction", "talkedToVillager",
            "noteblockPlayed", "sprintOneCm", "deaths", "drop", "fishCaught", "diveOneCm",
            "chestOpened", "recordPlayed", "jump", "fallOneCm", "crouchOneCm", 
            "craftingTableInteraction", "dropperInspected", "boatOneCm", "brewingstandInteraction",
            "dispenserInspected", "tradedWithVillager", "noteblockTuned", "cauldronUsed",
            "damageDealt", "damageTaken", "sleepInBed", "flowerPotted", "walkOneCm", "animalsBred", 
            "playerKills", "minecartOneCm", "shulkerBoxOpened", "itemEnchanted", "mobKills", "sneakTime",
            "armorCleaned", "playOneMinute", "timeSinceDeath", "flyOneCm"]


        // In 17w47a various blocks were renamed or separated into their own IDs. Statistics would track everything as DV0
        // Meaning all colour of wool would be treated as DV0 wool (White), this later converts into white_wool so we do similarly
        let GeneralRenamingRename: string[] = [
            "grass_block", "oak_sapling", "oak_planks", "oak_log", "oak_leaves", "note_block", "red_bed", "powered_rail",
            "cobweb", "grass", "dead_bush", "white_wool", "dandelion", "poppy", "moving_piston", "bricks", "oak_door", 
            "cobblestone_stairs", "snow_block", "snow", "sugar_cane", "oak_fence", "carved_pumpkin", 
            "jack_o_lantern", "repeater", "white_stained_glass", "oak_trapdoor", "infested_stone","stone_bricks", 
            "oak_fence_gate", "lily_pad", "nether_bricks", "oak_slab", "oak_button", "skeleton_skull", "comparator", 
            "nether_quartz_ore", "white_terracotta", "white_stained_glass_pane", "acacia_leaves", "acacia_log", "slime_block", 
            "white_carpet", "sunflower", "red_sandstone_slab", "end_stone_bricks", "magma_block", "red_nether_bricks",
            "white_concrete", "white_concrete_powder", "gray_shulker_box", "gray_glazed_terracotta",

            "cod", "cooked_cod", "ink_sac", "pig_spawn_egg", "firework_rocket", "firework_star", "nether_brick",

            "music_disc_13", "music_disc_cat", "music_disc_blocks", "music_disc_chirp", "music_disc_far", "music_disc_mall",
            "music_disc_mellohi", "music_disc_stal", "music_disc_strad", "music_disc_ward", "music_disc_11", "music_disc_wait"
        ]

        let GeneralRenamingOriginal: string[] = [
            "grass", "sapling", "planks", "log", "leaves", "noteblock", "bed", "golden_rail", "web", "tallgrass", "deadbush", 
            "wool", "yellow_flower", "red_flower", "piston_extension", "brick_block", "wooden_door", "stone_stairs",
            "snow", "snow_layer", "snow_ball", "reeds", "fence", "pumpkin", "lit_pumpkin",  "unpowered_repeater", "stained_glass", 
            "trapdoor", "monster_egg", "stonebrick", "fence_gate", "waterlily", "nether_brick", "wooden_slab", "wooden_button", 
            "skull", "unpowered_comparator", "quartz_ore", "stained_hardened_clay", "stained_glass_pane", "leaves2", "log2", 
            "slime", "carpet", "double_plant", "stone_slab2", "end_bricks", "magma", "red_nether_brick", "concrete", "concrete_powder",
            "silver_shulker_box", "silver_glazed_terracotta",

            "fish", "cooked_fish", "dye", "spawn_egg", "fireworks", "firework_charge", "netherbrick",
            
            "record_13", "record_cat", "record_blocks", "record_chirp", "record_far", "record_mall", "record_mellohi", "record_stal",
            "record_strad", "record_ward", "record_11", "record_wait"
        ]

        let statFileJSON = JSON.stringify(JSON.parse(statFile), null, 2);

        let used: string[] = [], broken: string[] = [], crafted: string[] = [], dropped: string[] = [], pickedup: string[] = [], 
        mined: string[] = [], killed: string[] = [], killedby: string[] = [], custom: string[] = [];

        // adds sacrificial character to the last entry as to not delete the final character
        // if not it'd either removes the value making the JSON invalid or divides it by 10.
        statFileJSON = statFileJSON.replace("\n}", "#\n}");

        // Regex is a scary thing, thankfully there are braver people than me
        // https://stackoverflow.com/questions/55218064
        for (let line of statFileJSON.split(/[\r\n]+/))
        {
            line = line.toLowerCase();

            // Updates into new format, but again
            // UpperCamelCase is lowered to work with the newly lowered line
            // Tactically placed here to deal with pig verses pigzombie.
            for(let i = 0; i < EntityLowerSnakecase.length; i++)
            {
                line = line.replace("stat.killentity." + EntityUpperCamelCase[i].toLocaleLowerCase(), "stat.killentity." + EntityLowerSnakecase[i]);
                line = line.replace("stat.entitykilledby." + EntityUpperCamelCase[i].toLocaleLowerCase(), "stat.entitykilledby." + EntityLowerSnakecase[i]);
            }

            // double quotation as to only replace the entire ID
            for(let i = 0; i < GeneralRenamingOriginal.length; i++) 
            { 
                line = line.replace("minecraft." + GeneralRenamingOriginal[i] + "\"", "minecraft." + GeneralRenamingRename[i] + "\"");
            }

            let formattedLine = line.split(".");
            switch(formattedLine[1])
            {
                case "useitem":
                    {
                        used.push("\"minecraft:" + formattedLine[formattedLine.length - 1]);
                        break;
                    }

                case "breakitem":
                    {
                        broken.push("\"minecraft:" + formattedLine[formattedLine.length - 1]);
                        break;
                    }

                case "craftitem":
                    {
                        crafted.push("\"minecraft:" + formattedLine[formattedLine.length - 1]);
                        break;
                    }

                case "drop":
                    {
                        dropped.push("\"minecraft:" + formattedLine[formattedLine.length - 1]);
                        break;
                    }

                case "pickup":
                    {
                        pickedup.push("\"minecraft:" + formattedLine[formattedLine.length - 1]);
                        break;
                    }

                case "mineblock":
                    {
                        mined.push("\"minecraft:" + formattedLine[formattedLine.length - 1]);
                        break;
                    }

                case "killentity":
                    {
                        killed.push("\"minecraft:" + formattedLine[formattedLine.length - 1]);
                        break;
                    }

                case "entitykilledby":
                    {
                        killedby.push("\"minecraft:" + formattedLine[formattedLine.length - 1]);
                        break;
                    }

                default:
                {
                    if(!formattedLine[0].includes("stat")) break;
                    custom.push("\"minecraft:" + formattedLine[formattedLine.length - 1]);
                }
            }
        }

        let flatteningStatFile: string = "{ \"stats\": {";

        if(custom.length)
        {
            flatteningStatFile += "\"minecraft:custom\": {";

            for(let i = 0; i < custom.length; i++)
            {
                for(let j = 0; j < GeneralStatLower.length; j++)
                {
                    custom[i] = custom[i].replace(GeneralStatUpper[j].toLowerCase(), GeneralStatLower[j]);
                }

                flatteningStatFile += custom[i];
            }

            // Removes extra comma at the end off each section
            flatteningStatFile = flatteningStatFile.substring(0, flatteningStatFile.length - 1);
            flatteningStatFile += "},";
        }
        
        if(used.length)
        {
            flatteningStatFile += "\"minecraft:used\": {";
            used.forEach(element => {flatteningStatFile += element;});

            // Removes extra comma at the end off each section
            flatteningStatFile = flatteningStatFile.substring(0, flatteningStatFile.length - 1);
            flatteningStatFile += "},";
        }        

        if(broken.length)
        {
            flatteningStatFile += "\"minecraft:broken\": {";
            broken.forEach(element => {flatteningStatFile += element;});

            // Removes extra comma at the end off each section
            flatteningStatFile = flatteningStatFile.substring(0, flatteningStatFile.length - 1);
            flatteningStatFile += "},";
        }

        if(crafted.length)
        {
            flatteningStatFile += "\"minecraft:crafted\": {";
            crafted.forEach(element => {flatteningStatFile += element;});

            // Removes extra comma at the end off each section
            flatteningStatFile = flatteningStatFile.substring(0, flatteningStatFile.length - 1);
            flatteningStatFile += "},";
        }

        if(dropped.length)
        {
            flatteningStatFile += "\"minecraft:dropped\": {";
            dropped.forEach(element => {flatteningStatFile += element;});

            // Removes extra comma at the end off each section
            flatteningStatFile = flatteningStatFile.substring(0, flatteningStatFile.length - 1);
            flatteningStatFile += "},";
        }

        if(pickedup.length)
        {
            flatteningStatFile += "\"minecraft:picked_up\": {";
            pickedup.forEach(element => {flatteningStatFile += element;});

            // Removes extra comma at the end off each section
            flatteningStatFile = flatteningStatFile.substring(0, flatteningStatFile.length - 1);
            flatteningStatFile += "},";
        }

        if(mined.length)
        {
            flatteningStatFile += "\"minecraft:mined\": {";
            mined.forEach(element => {flatteningStatFile += element;});

            // Removes extra comma at the end off each section
            flatteningStatFile = flatteningStatFile.substring(0, flatteningStatFile.length - 1);
            flatteningStatFile += "},";
        }

        if(killed.length)
        {
            flatteningStatFile += "\"minecraft:killed\": {";
            killed.forEach(element => {flatteningStatFile += element;});

            // Removes extra comma at the end off each section
            flatteningStatFile = flatteningStatFile.substring(0, flatteningStatFile.length - 1);
            flatteningStatFile += "},";
        }
        
        if(killedby.length)
        {
            flatteningStatFile += "\"minecraft:killed_by\": {";
            killedby.forEach(element => {flatteningStatFile += element;});

            // Removes extra comma at the end off each section
            flatteningStatFile = flatteningStatFile.substring(0, flatteningStatFile.length - 1);
            flatteningStatFile += "},";
        }

        // Removes extra comma at the end off each section
        statFile = flatteningStatFile.substring(0, flatteningStatFile.length - 1);
        statFile += "}, \"DataVersion\": 1451}"; // Manual dataversion due to existing for only 1 update

        // Odd items for flattenings
        statFile = statFile.replaceAll("minecraft:spawn_egg", "minecraft:pig_spawn_egg")

    }

    if(VerIndex > 7) // hardened clay into terracota (17w47b)
    {
        statFile = statFile.replaceAll("minecraft:hardened_clay", "minecraft:terracotta");
        statFile = statFile.replace("\"DataVersion\": 1451", "\"DataVersion\": 1452"); // Shout out to 18w19a which datafixer deletes any stat file from 17w47a (data ver 1451)
    }

    if(VerIndex > 8) // turtle shell piece into scute (18w07b)
    {
        statFile = statFile.replaceAll("minecraft:turtle_shell_piece", "minecraft:turtle_scute");
    }

    if(VerIndex > 9) // corals (18w14b)
    {
        let CoralColour: string[] = ["blue", "pink", "purple", "red", "yellow"];
        let CoralVariant: string[] = ["tube", "brain", "bubble", "fire", "horn"];

        // Changes the colour for variant
        for(let i = 0; i < CoralColour.length; i++)
        {
            console.log(CoralColour[i] + " replaceAlls " + CoralVariant[i]);

            statFile = statFile.replaceAll(CoralColour[i] + "_dead_coral", "dead_" + CoralVariant[i] + "_coral_block");

            statFile = statFile.replaceAll(CoralColour[i] + "_coral", CoralVariant[i] + "_coral_block");

            statFile = statFile.replaceAll("_coral_block_plant", "_coral"); // without "Block" in-game

            statFile = statFile.replaceAll("_coral_block_fan", "_coral_fan"); // without "Block" in-game

        }
    }

    if(VerIndex > 10) // puffer_fish into pufferfish and sea_grass into seagrass (18w19a)
    {
        statFile = statFile.replaceAll("minecraft:puffer_fish", "minecraft:pufferfish");
        statFile = statFile.replaceAll("minecraft:sea_grass", "minecraft:seagrass");
    }

    if(VerIndex > 11) // kelp_top into kelp and primarine brick slabs and stairs (18w20a)
    {
        statFile = statFile.replaceAll("minecraft:kelp", "minecraft:kelp_plant");
        statFile = statFile.replaceAll("minecraft:kelp_plant_top", "minecraft:kelp"); // actually called kelp_top

        statFile = statFile.replaceAll("minecraft:prismarine_bricks_slab", "minecraft:prismarine_brick_slab");
        statFile = statFile.replaceAll("minecraft:prismarine_bricks_stair", "minecraft:prismarine_brick_stair");
        
        statFile = statFile.replaceAll("minecraft:cod_mob", "minecraft:cod");
        statFile = statFile.replaceAll("minecraft:salmon_mob", "minecraft:salmon");
    }

    if(VerIndex > 12) // Melons (18w20b)
    {
        statFile = statFile.replaceAll("minecraft:melon", "minecraft:melon_slice");
        statFile = statFile.replaceAll("minecraft:melon_slice_block", "minecraft:melon"); // actually melon_block
        statFile = statFile.replaceAll("minecraft:speckled_melon", "minecraft:glistering_melon_slice");
    }

    if(VerIndex > 13) // Misc entity renames and clownfish buckets 1.13pre5
    {

    statFile = statFile.replaceAll("clownfish", "tropical_fish");

    let EntityOriginalFlattening: string[] = [ "evocation_illager", "vindication_illager", 
        "illusion_illager", "evocation_fangs", "commandblock_minecart", "ender_crystal",
        "eye_of_ender_signal", "fireworks_rocket", "snowman", "villager_golem", "xp_bottle", "xp_orb"
    ]

    let EntityRenameFlattening: string[] = [ "evoker", "vindicator", "illusioner", "evoker_fangs", 
        "command_block_minecart", "end_crystal", "eye_of_ender", "firework_rocket", "snow_golem", 
        "iron_golem", "experience_bottle", "experience_orb"
    ]

        for(let i = 0; i < EntityOriginalFlattening.length;i++)
        {
            statFile = statFile.replaceAll(EntityOriginalFlattening[i], EntityRenameFlattening[i]);
        }

    }

    if(VerIndex > 14) // grass into short_grass
    {
        statFile = statFile.replaceAll("minecraft:grass", "minecraft:short_grass");
    }

    Save(statFile)
}