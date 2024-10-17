import { AdvancedDynamicTexture,  Button, Rectangle, Control, TextBlock} from "@babylonjs/gui";
import { castleToFarmPaths, DEBUGMODE, GUIFONT1, modelsDir } from "../utils/CONSTANTS";
import { PlayMode } from "../scenes/playmode";
import { wheatUpgradesMax, wheatUpgradeValue, farmUpgradeMax, mineUpgradeMax, oreUpgradeValue, weaponUpgradeValue, forgeUpgradeMax, farmersMaxPerFarm, villagesUpgradeValue, barracksUpgradeMax, lootUpgradeValue, thievesGuildUpgradeMax, goldBarUpgradeValue, workShopUpgradeMax, portalUpgradeValue, towerUpgradeMax, relicUpgradeValue, tavernUpgradeMax } from "../utils/MATHCONSTANTS";
import { UpgradeSection } from "./upgradeSection";
import { UpgradeWindow } from "./upgradeWindows";
import { InSceneStuctureGUI } from "./inSceneStructureGUI";
import { GameStateObserverI, GameStateI, MathStateObserverI, MathStateI, StructureStateI, GUIProductCounterI } from "../../typings";
import { App } from "../app";
import { StartScreen } from "../scenes/start_screen";
import { AddStructureButton } from "./addStructureButton";
import { Runner } from "../models_characters/runners";
import { ProductCounter } from "./productCounter";
import { EpicUpgradeSection } from "./epicUpgradeSection";
import { StructureFarm01 } from "../structures/structureFarm01";
import { StructureFarm02 } from "../structures/structureFarm02";
import { StructureFarm03 } from "../structures/structureFarm03";
import { StructureFarm04 } from "../structures/structureFarm04";

export class GUIPlay implements GameStateObserverI, MathStateObserverI {
    private _app:App;
    private _gameState:GameStateI;
    private _mathState:MathStateI;
    public name:string;
    public scene:PlayMode;
 
    //GUI
    public gameGUI:AdvancedDynamicTexture;
    
    //Top
    private _wrapperTop:Rectangle;
    private _farmersCount:GUIProductCounterI;
    private _goldPerSecondCount:GUIProductCounterI;
    private _goldCount:GUIProductCounterI;
    private _lumenCount:GUIProductCounterI;
    private _oreCount:GUIProductCounterI;
    private _weaponCount:GUIProductCounterI;
    private _villageCount:GUIProductCounterI;
    private _lootCount:GUIProductCounterI;
    private _goldBarsCount:GUIProductCounterI;
    private _portalsCount:GUIProductCounterI;
    private _relicsCount:GUIProductCounterI;


    //Bottom
    private _playGUIWrapperBottom:Rectangle;
    private _epicUpgradesBtn
    private _addFarmerBtn:Button;

    //epic
    public GUIWrapperEpicUpgrade:Rectangle;

    private _upgradeAddFarmers:Rectangle;
    private _epicUpgradeBaseGold:Rectangle;
    
    //castle
    public GUIWrapperCastleUpgrade:Rectangle;
    private _addMineButton:AddStructureButton;
    private _addForgeButton:AddStructureButton;
    private _addBarracksButton:AddStructureButton;
    private _addThievesGuildButton:AddStructureButton;
    private _addWorkShopButton:AddStructureButton;
    private _addTowerButton:AddStructureButton;
    private _addTavernButton:AddStructureButton;
 
    //farms
    public GUIWrapperFarmUpgrade:Rectangle;
    public farmersMaxTextBox:TextBlock;
    private _wheatUpgrade:UpgradeSection;
    private _farmUpgrade01Section:UpgradeSection;
    private _farmUpgrade02Section:UpgradeSection;
    private _farmUpgrade03Section:UpgradeSection;
    private _farmUpgrade04Section:UpgradeSection;
    private _farmUpgradeSections:UpgradeSection[];
    private _addFarmButton02:AddStructureButton;
    private _addFarmButton03:AddStructureButton;
    private _addFarmButton04:AddStructureButton;
    private _addFarmButtons: AddStructureButton[];

    //mine
    public wrapperMineUpgrade:Rectangle;
    private _mineUpgradeSection:UpgradeSection;
    public mineInSceneGUI:Rectangle;

    //forge
    public wrapperForgeUpgrade:Rectangle;
    private _forgeUpgradeSection:UpgradeSection;
    public forgeInSceneGUI:Rectangle;

    //barracks
    public wrapperBarracksUpgrade:Rectangle;
    private _barracksUpgradeSection:UpgradeSection;
    public barracksInSceneGUI:Rectangle;

    //thievesGuild
    public wrapperThievesGuildUpgrade:Rectangle;
    private _thievesGuildUpgradeSection:UpgradeSection;
    public thievesGuildInSceneGUI:Rectangle;

    //workShop
    public wrapperWorkShopUpgrade:Rectangle;
    private _workShopUpgradeSection:UpgradeSection;
    public workShopInSceneGUI:Rectangle;

    //tower
    public wrapperTowerUpgrade:Rectangle;
    private _towerUpgradeSection:UpgradeSection;
    public towerInSceneGUI:Rectangle;

    //tavern
    public wrapperTavernUpgrade:Rectangle;
    private _tavernUpgradeSection:UpgradeSection;
    public tavernInSceneGUI:Rectangle;

    constructor(app:App, scene:PlayMode) {
        this.name='GUIPlay';
        this._app = app;
        this.scene = scene;
        this._mathState = this.scene.mathState
        this._mathState.attach(this);
        this._app.gameState.attach(this);
        
        this._farmUpgradeSections = [];//there are multiple farm upgrades so we need this array to hold them.
        
        //GUI//
        this.gameGUI = AdvancedDynamicTexture.CreateFullscreenUI('GameGui')
        this.gameGUI.idealHeight = 1080;
        this.gameGUI.idealWidth = 1920;
        
        //TOP
        //playGUITop
        this._wrapperTop = new Rectangle('playGUIWrapperTop');
        this._wrapperTop.width = 0.8;
        this._wrapperTop.height= 0.12;
        this._wrapperTop.thickness = 1;
        this._wrapperTop.top = -400;
        this.gameGUI.addControl(this._wrapperTop);

        //Products
        this._farmersCount = new ProductCounter('Farmers', 0, 0, `${this._mathState.getTotalFarmers()}`, this._wrapperTop);
        this._goldPerSecondCount = new ProductCounter('Gold/Second', 24, 0, `${this._mathState.getGoldPerSecond()}`, this._wrapperTop);
        this._goldCount = new ProductCounter('Gold', 48, 0, `${this._mathState.getTotalGold()}`, this._wrapperTop);
        this._lumenCount = new ProductCounter('Lumens', 0, -300, `${this._mathState.getTotalLumens()}`, this._wrapperTop);
        this._oreCount = new ProductCounter('Ore', 0, 300, `${this._mathState.getTotalProductAmount('Ore')}`, this._wrapperTop);
        this._weaponCount = new ProductCounter('Weapons', 24, 300,`${this._mathState.getTotalProductAmount('Weapons')}`, this._wrapperTop);
        this._villageCount = new ProductCounter('Villages', 48, 300, `${this._mathState.getTotalProductAmount('Villages')}`, this._wrapperTop);
        this._lootCount = new ProductCounter('Loot', 72, 300, `${this._mathState.getTotalProductAmount('Loot')}`, this._wrapperTop);
        this._goldBarsCount = new ProductCounter('Goldbars', 0, 600, `${this._mathState.getTotalProductAmount('Goldbars')}`, this._wrapperTop);
        this._portalsCount = new ProductCounter('Portals', 24, 600, `${this._mathState.getTotalProductAmount('Portals')}`, this._wrapperTop);
        this._relicsCount = new ProductCounter('Relics', 48, 600, `${this._mathState.getTotalProductAmount('Relics')}`, this._wrapperTop);

        //Bottom
        //playGUIBottom
        this._playGUIWrapperBottom = new Rectangle('playGUIWrapperBottom');
        this._playGUIWrapperBottom.width = 0.8;
        this._playGUIWrapperBottom.height= 0.1;
        this._playGUIWrapperBottom.thickness = 1;
        this._playGUIWrapperBottom.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.gameGUI.addControl(this._playGUIWrapperBottom);

        //epic Upgrades Button
        this._epicUpgradesBtn = Button.CreateSimpleButton('epicUpgrades', "Epic Upgrades");
        this._epicUpgradesBtn.fontFamily = GUIFONT1;
        this._epicUpgradesBtn.width = 0.1;
        this._epicUpgradesBtn.height = 1;
        this._epicUpgradesBtn.color = 'white';
        this._epicUpgradesBtn.background = 'green';
        this._epicUpgradesBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._epicUpgradesBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        this._playGUIWrapperBottom.addControl(this._epicUpgradesBtn);

        this._epicUpgradesBtn.onPointerDownObservable.add(() => {
            
            this.GUIWrapperEpicUpgrade.isVisible = true;
        
        });


        //add Farmer button
        this._addFarmerBtn = Button.CreateSimpleButton("addFarmer", "Add Farmer");
        this._addFarmerBtn.fontFamily = GUIFONT1;
        this._addFarmerBtn.width = 0.2
        this._addFarmerBtn.height = "40px";
        this._addFarmerBtn.color = "white";
        this._addFarmerBtn.thickness = 2;
        this._addFarmerBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        
        this._playGUIWrapperBottom.addControl(this._addFarmerBtn);

        this._addFarmerBtn.onPointerDownObservable.add(() => {
            
            this._clickFunction();
        
        });

        //Epic Upgrades
        this.GUIWrapperEpicUpgrade = new UpgradeWindow('EpicUpgradeWindow', 'violet', this);
        
        this._upgradeAddFarmers = new EpicUpgradeSection('Add Farmers', this.scene.epicAddFarmersUpgrade, this.GUIWrapperEpicUpgrade, -320, this.scene, null);
        this._epicUpgradeBaseGold = new EpicUpgradeSection('Starting Gold', this.scene.epicUpgradeBaseGold, this.GUIWrapperEpicUpgrade, -200, this.scene, null);

        //Farm Upgrades
        //this is the GUI that Appears when you click on the Farm to upgrade
        this.GUIWrapperFarmUpgrade = new UpgradeWindow('FarmUpgradeWindow' , 'brown', this);

        this.farmersMaxTextBox = new TextBlock('MaxFarmers', `Max Famers: ${this._mathState.getFarmersMax()}`);
        this.farmersMaxTextBox.fontFamily = GUIFONT1;
        this.farmersMaxTextBox.top = -430;
        this.farmersMaxTextBox.width = .3;
        this.farmersMaxTextBox.color= 'white';
        this.GUIWrapperFarmUpgrade.addControl(this.farmersMaxTextBox);

        //this creates the wheat Upgrade section on the Farm Window
        this._wheatUpgrade = new UpgradeSection('wheatUpgrade', `adds %${wheatUpgradeValue * 100} gold/second`, this._mathState.costOfWheatUpgrade, null, wheatUpgradesMax, this.GUIWrapperFarmUpgrade, -320, this.scene, () => this.wheatUpgradeCallback());

        //this creates the farm Upgrade section on the GUI
        this._farmUpgrade01Section = new UpgradeSection('Farm 01 Upgrades', `next Uprade allows ${this._checkUpgradeFarmersMax(this.scene.farm01)} farmers on this farm`, this.scene.farm01.getUpgradeCostGold(), null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, -200, this.scene, () => this._farmUpgradeCallBack(this.scene.farm01));
        
        this._farmUpgrade02Section = new UpgradeSection('Farm 02 Upgrades', `next Uprade allows ${this._checkUpgradeFarmersMax(this.scene.farm02)} farmers on this farm`, this.scene.farm02.getUpgradeCostGold(), null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, -80, this.scene, () => this._farmUpgradeCallBack(this.scene.farm02));
        this._farmUpgrade02Section.wrapperUpgradeContainer.isVisible = false;
        
        this._farmUpgrade03Section = new UpgradeSection('Farm 03 Upgrades', `next Uprade allows ${this._checkUpgradeFarmersMax(this.scene.farm03)} farmers on this farm`, this.scene.farm03.getUpgradeCostGold(), null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, 40, this.scene, () => this._farmUpgradeCallBack(this.scene.farm03));
        this._farmUpgrade03Section.wrapperUpgradeContainer.isVisible = false;

        this._farmUpgrade04Section = new UpgradeSection('Farm 04 Upgrades', `next Uprade allows  ${this._checkUpgradeFarmersMax(this.scene.farm04)} farmers on this farm`, this.scene.farm04.getUpgradeCostGold(), null, farmUpgradeMax, this.GUIWrapperFarmUpgrade, 160, this.scene, () => this._farmUpgradeCallBack(this.scene.farm04));
        this._farmUpgrade04Section.wrapperUpgradeContainer.isVisible = false;
        this._farmUpgradeSections.push(this._farmUpgrade01Section, this._farmUpgrade02Section, this._farmUpgrade03Section, this._farmUpgrade04Section);
        
        //ADDFarm Buttons.
        this._addFarmButtons =[];

        this._addFarmButton02 = new AddStructureButton('addFarm02Button', this, this._farmUpgrade02Section,this.GUIWrapperFarmUpgrade as UpgradeWindow, -80, this.scene.farm02, () => this._farmAdditionCallback(this.GUIWrapperFarmUpgrade, 'addFarm03Button', this._farmUpgrade02Section, this.scene.farm02));
        this.GUIWrapperFarmUpgrade.addControl(this._addFarmButton02);

        this._addFarmButton03 = new AddStructureButton('addFarm03Button', this, this._farmUpgrade03Section,this.GUIWrapperFarmUpgrade as UpgradeWindow, 40, this.scene.farm03, () => this._farmAdditionCallback(this.GUIWrapperFarmUpgrade, 'addFarm04Button', this._farmUpgrade03Section, this.scene.farm03));
        this._addFarmButton03.isEnabled = false;
        this._addFarmButton03.isVisible = false;
        this.GUIWrapperFarmUpgrade.addControl(this._addFarmButton03);

        this._addFarmButton04 = new AddStructureButton('addFarm04Button', this, this._farmUpgrade04Section,this.GUIWrapperFarmUpgrade as UpgradeWindow, 160, this.scene.farm04, () => this._farmAdditionCallback(this.GUIWrapperFarmUpgrade, null, this._farmUpgrade04Section, this.scene.farm04));
        this._addFarmButton04.isEnabled = false;
        this._addFarmButton04.isVisible = false;
        this.GUIWrapperFarmUpgrade.addControl(this._addFarmButton04);

        this._addFarmButtons.push(this._addFarmButton02, this._addFarmButton03, this._addFarmButton04);

        //Mine Upgrades
        this.wrapperMineUpgrade = new UpgradeWindow('mineUpgradeWindow', 'DarkSlateGray', this);
        const oreValue = oreUpgradeValue * 100;
        
        this._mineUpgradeSection = new UpgradeSection('MineUpgradeSection', `Speeds Up Ore Production by ${oreValue}%`, this.scene.mine.getUpgradeCostGold(), ['farmers', this.scene.mine.getUpgradeCostFarmers()], mineUpgradeMax, this.wrapperMineUpgrade, -320, this.scene, () => {this._mineUpgradeCallback()});

        this.mineInSceneGUI = new InSceneStuctureGUI('MineSceneGui', this, this.scene.mine, 'Ore');
        
        //Forge Upgrades
        this.wrapperForgeUpgrade = new UpgradeWindow('ForgeUpgradeWindow', 'skyblue', this);
        const weaponValue = weaponUpgradeValue * 100;
        
        this._forgeUpgradeSection = new UpgradeSection('ForgeUpgradeSection', `Speeds Up Weapon Production by ${weaponValue}%`, this.scene.forge.getUpgradeCostGold(), ['farmers', this.scene.forge.getUpgradeCostFarmers()], forgeUpgradeMax, this.wrapperForgeUpgrade, -320, this.scene, () => {this._forgeUpgradeCallback()});
        
        this.forgeInSceneGUI = new InSceneStuctureGUI('ForgeSceneGui', this, this.scene.forge, 'Weapons')

        //Barracks Upgrades
        this.wrapperBarracksUpgrade = new UpgradeWindow('BarracksUpgradeWindow', 'black', this);
        const villageValue = villagesUpgradeValue * 100;
        
        this._barracksUpgradeSection = new UpgradeSection('BarrackUpgradeSection', `Speeds Up Village Capture by ${villageValue}%`, this.scene.barracks.getUpgradeCostGold(), ['farmers', this.scene.barracks.getUpgradeCostFarmers()], barracksUpgradeMax, this.wrapperBarracksUpgrade, -320, this.scene, () => {this._barracksUpgradeCallback()});
        
        this.barracksInSceneGUI = new InSceneStuctureGUI('BarracksSceneGui', this, this.scene.barracks, 'Villages');
        
        //ThievesGuild Upgrades
        this.wrapperThievesGuildUpgrade = new UpgradeWindow('ThievesGuildUpgradeWindow', 'orange', this);
        const LootValue = lootUpgradeValue * 100;
        
        this._thievesGuildUpgradeSection = new UpgradeSection('ThievesGuildUpgradeSection', `Speeds Up Loot Capture by ${LootValue}%`, this.scene.thievesGuild.getUpgradeCostGold(), ['farmers', this.scene.thievesGuild.getUpgradeCostFarmers()], thievesGuildUpgradeMax, this.wrapperThievesGuildUpgrade, -320, this.scene, () => {this._thievesGuildUpgradeCallback()});
        
        this.thievesGuildInSceneGUI = new InSceneStuctureGUI('ThievesGuildSceneGui', this, this.scene.thievesGuild, 'Loot');

        //WorkShop Upgrades
        this.wrapperWorkShopUpgrade = new UpgradeWindow('WorkShopUpgradeWindow', 'orange', this);
        const goldbarValue = goldBarUpgradeValue * 100;
        
        this._workShopUpgradeSection = new UpgradeSection('WorkShopUpgradeSection', `Speeds Up GoldBar Creation by ${goldbarValue}%`, this.scene.workShop.getUpgradeCostGold(), ['farmers', this.scene.workShop.getUpgradeCostFarmers()], workShopUpgradeMax, this.wrapperWorkShopUpgrade, -320, this.scene, () => {this._workShopUpgradeCallback()});
        
        this.workShopInSceneGUI = new InSceneStuctureGUI('WorkShopSceneGui', this, this.scene.workShop, 'Goldbars');

        //tower Upgrades
        this.wrapperTowerUpgrade = new UpgradeWindow('TowerUpgradeWindow', 'orange', this);
        const portalValue = portalUpgradeValue * 100;
        
        this._towerUpgradeSection = new UpgradeSection('TowerUpgradeSection', `Speeds Up Portal Creation by ${portalValue}%`, this.scene.tower.getUpgradeCostGold(), ['farmers', this.scene.tower.getUpgradeCostFarmers()], towerUpgradeMax, this.wrapperTowerUpgrade, -320, this.scene, () => {this._towerUpgradeCallback()});
        
        this.towerInSceneGUI = new InSceneStuctureGUI('TowerSceneGui', this, this.scene.tower, 'Portals');

        //tavern Upgrades
        this.wrapperTavernUpgrade = new UpgradeWindow('Tavern UpgradeWindow', 'orange', this);
        const relicValue = relicUpgradeValue * 100;
        
        this._tavernUpgradeSection = new UpgradeSection('TavernUpgradeSection', `Speeds Up Relic Creation by ${relicValue}%`, this.scene.tavern.getUpgradeCostGold(), ['farmers', this.scene.tavern.getUpgradeCostFarmers()], tavernUpgradeMax, this.wrapperTavernUpgrade, -320, this.scene, () => {this._tavernUpgradeCallback()});
        
        this.tavernInSceneGUI = new InSceneStuctureGUI('TavernSceneGui', this, this.scene.tavern, 'Relics');

        //Castle Upgrades
        //this is the GUI that Appears when you click on the Castle to upgrade
        this.GUIWrapperCastleUpgrade = new UpgradeWindow('castleUpgradeWindow', 'gray', this);

        this._addMineButton = new AddStructureButton('addMineButton', this, this._mineUpgradeSection,this.GUIWrapperCastleUpgrade as UpgradeWindow, -320, this.scene.mine, () => {this._mineAdditionCallback()});
        this.GUIWrapperCastleUpgrade.addControl(this._addMineButton);
        this._addMineButton.isEnabled = false;

        this._addForgeButton = new AddStructureButton('addForgeButton', this, this._forgeUpgradeSection, this.GUIWrapperCastleUpgrade as UpgradeWindow, -200, this.scene.forge, () => {this._forgeAdditionCallback()});
        this.GUIWrapperCastleUpgrade.addControl(this._addForgeButton);
        this._addForgeButton.isEnabled = false;

        this._addBarracksButton = new AddStructureButton('addBarracksButton', this, this._barracksUpgradeSection, this.GUIWrapperCastleUpgrade as UpgradeWindow, -80, this.scene.barracks, () => {this._barracksAdditionCallback()});
        this.GUIWrapperCastleUpgrade.addControl(this._addBarracksButton);
        this._addBarracksButton.isEnabled = false;

        this._addThievesGuildButton = new AddStructureButton('addThievesGuildButton', this, this._thievesGuildUpgradeSection, this.GUIWrapperCastleUpgrade as UpgradeWindow,  40, this.scene.thievesGuild, () => {this._thievesGuildAdditionCallback()});
        this.GUIWrapperCastleUpgrade.addControl(this._addThievesGuildButton);
        this._addThievesGuildButton.isEnabled = false;

        this._addWorkShopButton = new AddStructureButton('addWorkShopButton', this, this._workShopUpgradeSection, this.GUIWrapperCastleUpgrade as UpgradeWindow,  160, this.scene.workShop, () => {this._workShopAdditionCallback()});
        this.GUIWrapperCastleUpgrade.addControl(this._addWorkShopButton);
        this._addWorkShopButton.isEnabled = false;

        this._addTowerButton = new AddStructureButton('addTowerButton', this, this._towerUpgradeSection, this.GUIWrapperCastleUpgrade as UpgradeWindow,  280, this.scene.tower, () => {this._towerAdditionCallback()});
        this.GUIWrapperCastleUpgrade.addControl(this._addTowerButton);
        this._addTowerButton.isEnabled = false;

        this._addTavernButton = new AddStructureButton('addTavernButton', this, this._tavernUpgradeSection, this.GUIWrapperCastleUpgrade as UpgradeWindow,  400, this.scene.tavern, () => {this._tavernAdditionCallback()});
        this.GUIWrapperCastleUpgrade.addControl(this._addTavernButton);
        this._addTavernButton.isEnabled = false;
        

        //GAMELOOP//
        this.scene.onBeforeRenderObservable.add(() => {
            
            //wheat
            this._wheatUpgrade.upgradeAble = this._wheatUpgradeAllowed();

            //farms
            for (let i in this._farmUpgradeSections) {
                this._farmUpgradeSections[i].upgradeAble = this._farmUpgradeAllowed(this.scene.farms[i]);
            }
            
            for (let i = 0; i < this._addFarmButtons.length; i++) {
                
                //there is 3 Add Farm Buttons but 4 Farms so the two arrays compare at different sizes
                if(this._addFarmButtons[i].isVisible && this._mathState.getTotalGold() >= this.scene.farms[i + 1].getUpgradeCostGold()) {
                    this._addFarmButtons[i].isEnabled = true;
                } else if (this._addFarmButtons[i].isVisible && this._mathState.getTotalGold() < this.scene.farms[i + 1].getUpgradeCostGold()) {
                    this._addFarmButtons[i].isEnabled = false;
                }
            
            }

            //mine
            if (this._addMineButton.isVisible) {
                this._addMineButton.isEnabled = this._mineUpgradeAllow();
            }
           
            this._mineUpgradeSection.upgradeAble = this._mineUpgradeAllow();
            
            //forge
            if (this._addForgeButton.isVisible) {
                this._addForgeButton.isEnabled = this._forgeUpgradeAllow();
            }
            this._forgeUpgradeSection.upgradeAble = this._forgeUpgradeAllow();

            //barracks
            if (this._addBarracksButton.isVisible) {
                this._addBarracksButton.isEnabled = this._barracksUpgradeAllow();
            }
            this._barracksUpgradeSection.upgradeAble = this._barracksUpgradeAllow();

            //thievesGuild
            if (this._addThievesGuildButton.isVisible) {
                this._addThievesGuildButton.isEnabled = this._thievesGuildUpgradeAllow();
            }
            this._thievesGuildUpgradeSection.upgradeAble = this._thievesGuildUpgradeAllow();

            //workShop
            if (this._addWorkShopButton.isVisible) {
                this._addWorkShopButton.isEnabled = this._workShopUpgradeAllow();
            }
            this._workShopUpgradeSection.upgradeAble = this._workShopUpgradeAllow();

            //tower
            if (this._addTowerButton.isVisible) {
                this._addTowerButton.isEnabled = this._towerUpgradeAllow();
            }
            this._towerUpgradeSection.upgradeAble = this._towerUpgradeAllow();

            
            //tavern
            if (this._addTavernButton.isVisible) {
                this._addTavernButton.isEnabled = this._tavernUpgradeAllow();
            }
            this._tavernUpgradeSection.upgradeAble = this._tavernUpgradeAllow();

        });

    }

    private _clickFunction(){
        if (DEBUGMODE) {
            console.log('Add Farmer Button Clicked');
            console.log('mathStateFarmerMult: ', this.scene.epicAddFarmersUpgrade.getCurrentValue());
        }
            
        //make a farmer
        this._makeFarmer(this.scene.epicAddFarmersUpgrade.getCurrentValue());  
    }

    //this is the observer function to the MathState Class
    public updateMathState(mathState: MathStateI): void {
        
        //Everytime the MathState Class runs the game loop these update.
        this._farmersCount.changeText(`${mathState.getTotalFarmers()}`);
        this._goldPerSecondCount.changeText(`${mathState.getGoldPerSecond().toFixed(3)}`);
        this._goldCount.changeText(`${mathState.getTotalGold().toFixed(3)}`);
        this._lumenCount.changeText(`${this._mathState.getTotalLumens()}`);
        this._oreCount.changeText(`${this._mathState.getTotalProductAmount('Ore')}`);
        this._weaponCount.changeText(`${this._mathState.getTotalProductAmount('Weapons')}`);
        this._villageCount.changeText(`${this._mathState.getTotalProductAmount('Villages')}`);
        this._lootCount.changeText(`${this._mathState.getTotalProductAmount('Loot')}`);
        this._goldBarsCount.changeText(`${this._mathState.getTotalProductAmount('Goldbars')}`);
        this._portalsCount.changeText(`${this._mathState.getTotalProductAmount('Portals')}`);
        this._relicsCount.changeText(`${this._mathState.getTotalProductAmount('Relics')}`);
        
    }

    //wheat
    private _wheatUpgradeAllowed() {
        if (this._mathState.getTotalGold() > this._mathState.costOfWheatUpgrade) {
            return true;
        } else {
            return false;
        }
    }

     //Wheat
     public wheatUpgradeCallback() {
    
        if (this._mathState.wheatValue < wheatUpgradeValue * wheatUpgradesMax) {
            if (this._mathState.getTotalGold() > this._mathState.costOfWheatUpgrade) {
            
            //apply the value changes
            this._mathState.changeWheatValue();
            this._mathState.changeGoldPerSecond();

            //use gold
            this._mathState.spendGold(this._mathState.costOfWheatUpgrade);
            
            //apply cost change
            this._mathState.upgradeWheat();
            this._mathState.changeCostOfWheatUpgrade();

            this._wheatUpgrade.goldCost = this._mathState.costOfWheatUpgrade;

            }

        }
        
    }
    
    //farms
    private _farmUpgradeAllowed(farm:StructureStateI) {

        //this depends on whether the farm is completely upgraded or not.
        if (farm.getUpgradeLevel() < farmUpgradeMax) {
            
            if (this._mathState.getTotalGold() >= farm.getUpgradeCostGold()) {
                return true;
            } else {
                return false;
            }
        
        }
    }

    private _checkUpgradeFarmersMax(farm:StructureStateI) {
        let total = null;

        if (farm.getUpgradeLevel() < farmUpgradeMax) {
            total = Math.round(farmersMaxPerFarm(farm.getUpgradeLevel() + 1))
        } else {
            total = "Maxed out!";
        }

        return total;
    }

    private _farmAdditionCallback(wrapper:Rectangle, nextButton:string | null, upgradeSection:UpgradeSection, farm:StructureStateI) {
        //show the section in the GUI
        upgradeSection.wrapperUpgradeContainer.isVisible = true;

        //make the next add Farm Button Available
        if(nextButton !== null) {
            const searchedButton = wrapper.getChildByName(nextButton) as Button;
            searchedButton.isVisible = true;
        }

        //update the GUI
        for (let i in this._farmUpgradeSections) {
            this._farmUpgradeSections[i].instruction = `next Upgrade allows ${this._checkUpgradeFarmersMax(this.scene.farms[i])} farmers on this farm`
            this._farmUpgradeSections[i].textBlockUpgradeInstruction.text = this._farmUpgradeSections[i].instruction;
        }

        this.farmersMaxTextBox.text = `Max Farmers: ${this._mathState.getFarmersMax()}`;

    }

    private _farmUpgradeCallBack(farm:StructureFarm01 | StructureFarm02 | StructureFarm03 | StructureFarm04) {

        farm.upgradeState();

        for(let i in this._farmUpgradeSections) {
            this._farmUpgradeSections[i].goldCost = this.scene.farms[i].getUpgradeCostGold();
        }

        this.farmersMaxTextBox.text = `Max Farmers: ${this._mathState.getFarmersMax()}`;

    }
    
    //mine
    private _mineUpgradeAllow() {
        if(this.scene.mine.getUpgradeLevel() < mineUpgradeMax) {
            if(this._mathState.getTotalGold() > this.scene.mine.getUpgradeCostGold() && this._mathState.getTotalFarmers() > this.scene.mine.getUpgradeCostFarmers()) {
                return true;
            } else {
                return false;
            }
        }
    }

    //mine Callbacks

    private _mineAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addMineCalled');
        }
        
    }

    private _mineUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('mineUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.scene.mine.upgradeState();

        this._mineUpgradeSection.goldCost = this.scene.mine.getUpgradeCostGold();
        this._mineUpgradeSection.otherCost[1] = this.scene.mine.getUpgradeCostFarmers();

    }

    //forge
    private _forgeUpgradeAllow() {
        if(this.scene.forge.getUpgradeLevel() < forgeUpgradeMax) {
            if(this._mathState.getTotalGold() > this.scene.forge.getUpgradeCostGold() && this._mathState.getTotalFarmers() > this.scene.forge.getUpgradeCostFarmers()) {
                return true;
            } else {
                return false;
            }
        }
    }

    //forge Callbacks

    private _forgeAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addForgeCalled');
        }     
    }

    private _forgeUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('forgeUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.scene.forge.upgradeState();

        this._forgeUpgradeSection.goldCost = this.scene.forge.getUpgradeCostGold();
        this._forgeUpgradeSection.otherCost[1] = this.scene.forge.getUpgradeCostFarmers();

    }

    //barracks
    private _barracksUpgradeAllow() {
        if(this.scene.barracks.getUpgradeLevel() < barracksUpgradeMax) {
            if(this._mathState.getTotalGold() > this.scene.barracks.getUpgradeCostGold() && this._mathState.getTotalFarmers() > this.scene.barracks.getUpgradeCostFarmers()) {
                return true;
            } else {
                return false;
            }
        }
    }

    //barracks Callbacks

    private _barracksAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addBarracksCalled');
        }     
    }

    private _barracksUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('barracksUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.scene.barracks.upgradeState();

        this._barracksUpgradeSection.goldCost = this.scene.barracks.getUpgradeCostGold();
        this._barracksUpgradeSection.otherCost[1] = this.scene.barracks.getUpgradeCostFarmers();

    }

    //thievesGuild
    private _thievesGuildUpgradeAllow() {
        if(this.scene.thievesGuild.getUpgradeLevel() < thievesGuildUpgradeMax) {
            if(this._mathState.getTotalGold() > this.scene.thievesGuild.getUpgradeCostGold() && this._mathState.getTotalFarmers() > this.scene.thievesGuild.getUpgradeCostFarmers()) {
                return true;
            } else {
                return false;
            }
        }
    }

    //thievesGuild Callbacks

    private _thievesGuildAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addthievesGuildCalled');
        }     
    }

    private _thievesGuildUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('thievesGuildUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.scene.thievesGuild.upgradeState();

        this._thievesGuildUpgradeSection.goldCost = this.scene.thievesGuild.getUpgradeCostGold();
        this._thievesGuildUpgradeSection.otherCost[1] = this.scene.thievesGuild.getUpgradeCostFarmers();

    }

    //workShop
    private _workShopUpgradeAllow() {
        if(this.scene.workShop.getUpgradeLevel() < workShopUpgradeMax) {
            if(this._mathState.getTotalGold() > this.scene.workShop.getUpgradeCostGold() && this._mathState.getTotalFarmers() > this.scene.workShop.getUpgradeCostFarmers()) {
                return true;
            } else {
                return false;
            }
        }
    }

    //workshop Callbacks

    private _workShopAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addWorkshopCalled');
        }     
    }

    private _workShopUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('WorkShopUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.scene.workShop.upgradeState();

        this._workShopUpgradeSection.goldCost = this.scene.workShop.getUpgradeCostGold();
        this._workShopUpgradeSection.otherCost[1] = this.scene.workShop.getUpgradeCostFarmers();

    }

    //tower
    private _towerUpgradeAllow() {
        if(this.scene.tower.getUpgradeLevel() < towerUpgradeMax) {
            if(this._mathState.getTotalGold() > this.scene.tower.getUpgradeCostGold() && this._mathState.getTotalFarmers() > this.scene.tower.getUpgradeCostFarmers()) {
                return true;
            } else {
                return false;
            }
        }
    }

    //tower Callbacks

    private _towerAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addTowerCalled');
        }     
    }

    private _towerUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('TowerUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.scene.tower.upgradeState();

        this._towerUpgradeSection.goldCost = this.scene.tower.getUpgradeCostGold();
        this._towerUpgradeSection.otherCost[1] = this.scene.tower.getUpgradeCostFarmers();

    }

    //tavern
    private _tavernUpgradeAllow() {
        if(this.scene.tavern.getUpgradeLevel() < tavernUpgradeMax) {
            if(this._mathState.getTotalGold() > this.scene.tavern.getUpgradeCostGold() && this._mathState.getTotalFarmers() > this.scene.tavern.getUpgradeCostFarmers()) {
                return true;
            } else {
                return false;
            }
        }
    }

    //tavern Callbacks

    private _tavernAdditionCallback() {
        if (DEBUGMODE) {
            console.log('addTavernCalled');
        }     
    }

    private _tavernUpgradeCallback() {
        if (DEBUGMODE) {
            console.log('TavernUpgradeChangeCalled');
        }
        
        //upgrade the State
        this.scene.tavern.upgradeState();

        this._tavernUpgradeSection.goldCost = this.scene.tavern.getUpgradeCostGold();
        this._tavernUpgradeSection.otherCost[1] = this.scene.tavern.getUpgradeCostFarmers();

    }

    //GUI functions
    public showUpgrades(wrapper:Rectangle) {
        
        if (!wrapper.isVisible) {
            
            wrapper.isVisible = true;
        
        }
    }
    
    //Game interaction functions
    private _makeFarmer(amount:number) {
        let totalFarmers = this._mathState.getTotalFarmers();
        let runningFarmers = this._mathState.getRunningFarmers();
        const farmersMax = this._mathState.getFarmersMax();
        let currentCount = totalFarmers + runningFarmers;

        //first check if we are maxed out on farmers
        if(currentCount < farmersMax) { 
            let maxPossibleRunners = Math.min(amount, farmersMax - currentCount);
            let intervalCount = maxPossibleRunners;
            
            let runnerInterval = setInterval(() => {
                currentCount = this._mathState.getTotalFarmers() + this._mathState.getRunningFarmers();

                if(currentCount < farmersMax && intervalCount > 0) {
                    //let the mathstate know there is 1 runner
                    this._mathState.makeFarmerRun(1);
                    new Runner('farmer', currentCount, modelsDir, 'farmer.glb', this.scene, 0, castleToFarmPaths, () => {this.scene.mathState.addFarmers(1); this._mathState.endFarmerRun()});

                    intervalCount -= 1;

                }

                if(intervalCount <= 0 || currentCount >= farmersMax) {
                    clearInterval(runnerInterval);
                }
            
            }, 250);
     
        }  
    }


    public updateGameState(): void {
        
        if(this._gameState.state === 'END_SCREEN') {
            if (DEBUGMODE) {
                console.log('Game going to EndScreen');
            }
        }
        if(this._gameState.state === 'START_SCREEN') {
            if (DEBUGMODE) {
                console.log('Game going to StartScreen');
            }
            this._app.switchScene(new StartScreen(this._app.engine));
        }

    }

}