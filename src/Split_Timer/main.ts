
import { IPlugin, IModLoaderAPI } from 'modloader64_api/IModLoaderAPI';
import { onViUpdate } from  'modloader64_api/PluginLifecycle';
import { bool_ref, Col, Cond, TabBarFlags, string_ref, TreeNodeFlags, WindowFlags , StyleVar, FocusedFlags } from 'modloader64_api/Sylvain/ImGui';
import { Scancode } from 'modloader64_api/Sylvain/Keybd';
import { rgb, rgba, xy } from 'modloader64_api/Sylvain/vec';


//Authors: Codswallop, JerryWester

class Split_Timer implements IPlugin{

    ModLoader!: IModLoaderAPI;
    pluginName?: string | undefined;
    config!:any;
    

    preinit(): void {
        
    }
    init(): void {
        
        this.config = this.ModLoader.config.registerConfigCategory("Split_Timer");
        this.ModLoader.config.setData("Split_Timer", "Any%", [
            "Escape",
            "Kakariko",
            "Bottle",
            "Enter Deku Tree",
            "Gohma",
            "Ganondoor",
            "Collapse",
            "Ganon"
        ]);
        this.ModLoader.config.setData("Split_Timer", "100%", [
            "Escape",
            "Bottle",
            "Lens of Truth",
            "Zelda",
            "Master Sword",
            "Hover Boots",
            "Song of Storms",
            "Bombs",
            "Bolero of Fire",
            "Minuet of Forest",
            "Farore's Wind",
            "Iron Boots",
            "Boomerang",
            "Enter Water",
            "Longshot",
            "Leave Water",
            "Bow",
            "Forest WW",
            "Child 2",
            "Lon Lon HP",
            "Fishing",
            "Leave Zora's Fountain",
            "Bomb Bag",
            "Enter Graveyard",
            "Dampe",
            "Adult 2",
            "Fire Arrows",
            "Big Poe Bottle",
            "Nocturne of Shadow",
            "FW Warp in Shadow",
            "Shadow WW",
            "Slingshot",
            "Deku WW",
            "Spirit Boss Door",
            "Spirit WW",
            "Get Caught",
            "Gerudo Card",
            "Light Arrow CS",
            "Gold Gauntlets",
            "Child 3",
            "Ocarina of Time",
            "Mask of Truth",
            "Dog HP",
            "Slingshot Bag",
            "Adult 3",
            "Biggoron's Sword",
            "FW Warp in Fire",
            "Fire WW",
            "Castle Escape",
            "End"
        ]);
    }
    postinit(): void {
        
    }
    onTick(frame?: number | undefined): void {
    }

    isWindowOpen: bool_ref = [false]
    isPaused: boolean = true;
    currentTime: number = 0
    lastDateNow: number = 0
    laps: number[] = []
    isCategorySetupOpen: bool_ref = [false]
    singleLine1: string_ref = [""]
    multiLine1: string_ref = [""]
    isPopupOpen: bool_ref = [false]
    categoryName: string = ""
    delRoute: any
    
  

    
    
 
    

    parseTime(n: number): string{
        const seconds = (n / 1000) % 60;
        const minutes = Math.floor(n / 60000) % 60;
        const hours = Math.floor(n / 3600000);
        return `${hours < 10 ? "0"+hours.toString() : hours.toString()}:${minutes < 10 ? "0"+minutes.toString() : minutes.toString()}:${seconds < 10 ? "0"+seconds.toFixed(2) : seconds.toFixed(2)}`;
    }
    setRoute(categoryName: string, splitNames: string[]){
        this.ModLoader.config.setData("Split_Timer", categoryName, splitNames, true);
        this.ModLoader.config.save();
    }
    
    
    @onViUpdate()
    onViUpdate(){
        
        
        if(this.ModLoader.ImGui.beginMainMenuBar()){
            if(this.ModLoader.ImGui.beginMenu("Mods")){
                if(this.ModLoader.ImGui.menuItem("Stopwatch & Split Timer")){
                    this.isWindowOpen[0] = true;
                }
                this.ModLoader.ImGui.endMenu();
            }
            this.ModLoader.ImGui.endMainMenuBar();
        }
    
        if(this.isWindowOpen[0]){
            this.ModLoader.ImGui.pushStyleColor(Col.ResizeGrip, rgba(0,0,0,0))
            this.ModLoader.ImGui.setNextWindowSizeConstraints(xy(320,300), xy(320,900));
            this.ModLoader.ImGui.pushStyleVar(StyleVar.WindowBorderSize, 4);
            
            if(this.ModLoader.ImGui.begin("Stopwatch & Split Timer", this.isWindowOpen, WindowFlags.NoScrollbar + WindowFlags.NoCollapse)){
                if (this.ModLoader.ImGui.isWindowFocused(FocusedFlags.RootAndChildWindows)){
                    //Hotkey for Split
                    if (this.ModLoader.ImGui.isKeyPressed(Scancode.Space)){
                        this.laps.push(this.currentTime);
                    }
                    //Hotkey for Stop
                    if (this.ModLoader.ImGui.isKeyPressed(Scancode.D)){
                        this.isPaused = true;
                    }
                    //Hotkey for Start
                    if (this.ModLoader.ImGui.isKeyPressed(Scancode.S)){
                        if(this.isPaused){
                            this.lastDateNow = Date.now();
                            this.isPaused = false;
                        }
                    }
                    //Hotkey for Reset
                    if (this.ModLoader.ImGui.isKeyPressed(Scancode.R)){
                        this.isPaused = true;
                        this.currentTime = 0;
                        this.lastDateNow = 0;
                        this.laps = []; 
                    }
                    //Hotkey for Unsplit
                    if(this.ModLoader.ImGui.isKeyPressed(Scancode.Backspace)){
                        this.laps.pop();
                    }
                }
                if(!this.isPaused){
                    this.currentTime += Date.now() - this.lastDateNow;
                    this.lastDateNow = Date.now();
                }

                let btnw = 0;
                let columnResizeY = this.ModLoader.ImGui.getWindowHeight() - 250;
                let windowWidth = 320;
                let windowHeight = 600;
                let windowResizeHeight = this.ModLoader.ImGui.getWindowHeight() - 35;
                
                if (this.ModLoader.ImGui.collapsingHeader("Stopwatch", TreeNodeFlags.Framed + TreeNodeFlags.DefaultOpen)){
                
                    this.ModLoader.ImGui.pushStyleColor(Col.Text, rgb(255, 0, 0));
                    this.ModLoader.ImGui.text("                         ")
                    this.ModLoader.ImGui.sameLine()
                    this.ModLoader.ImGui.text(this.parseTime(this.currentTime));;
                    this.ModLoader.ImGui.popStyleColor(1);
                
                
                
                this.ModLoader.ImGui.setCursorPosX(this.ModLoader.ImGui.getCursorPosX() + this.ModLoader.ImGui.getWindowContentRegionWidth()/22 - btnw/2);
                this.ModLoader.ImGui.setWindowSize({x: windowWidth, y: windowHeight}, Cond.FirstUseEver);
                this.ModLoader.ImGui.pushStyleColor(Col.Button, rgb(42, 122, 0));
                
                if (this.ModLoader.ImGui.button("Start")) {
                    if(this.isPaused){
                        this.lastDateNow = Date.now();
                        this.isPaused = false;
                    }
                }
                //Tooltip for Start
                if (this.ModLoader.ImGui.isItemHovered()){
                    this.ModLoader.ImGui.beginTooltip();
                    this.ModLoader.ImGui.text("Hotkey: S")
                    this.ModLoader.ImGui.endTooltip();
                }
                this.ModLoader.ImGui.popStyleColor(1);
                btnw = this.ModLoader.ImGui.getItemRectSize().x;
                this.ModLoader.ImGui.sameLine();
                this.ModLoader.ImGui.pushStyleColor(Col.Button, rgb(122, 42, 0));
                
                if (this.ModLoader.ImGui.button("Stop")){
                    this.isPaused = true;
                }
                //Tooltip for Stop
                if (this.ModLoader.ImGui.isItemHovered()){
                    this.ModLoader.ImGui.beginTooltip();
                    this.ModLoader.ImGui.text("Hotkey: D")
                    this.ModLoader.ImGui.endTooltip();
                }
                this.ModLoader.ImGui.popStyleColor(1)
                btnw = this.ModLoader.ImGui.getItemRectSize().x;
                this.ModLoader.ImGui.sameLine();
                
                if (this.ModLoader.ImGui.button("Reset")){
                    this.isPaused = true;
                    this.currentTime = 0;
                    this.lastDateNow = 0;
                    this.laps = []; 
                }
                //Tooltip for Reset
                if (this.ModLoader.ImGui.isItemHovered()){
                    this.ModLoader.ImGui.beginTooltip();
                    this.ModLoader.ImGui.text("Hotkey: R")
                    this.ModLoader.ImGui.endTooltip();
                }
                btnw = this.ModLoader.ImGui.getItemRectSize().x;
                this.ModLoader.ImGui.sameLine();
                
                
                if (this.ModLoader.ImGui.button("Split")){
                    this.laps.push(this.currentTime);
                }
                //Tooltip for Split
                if (this.ModLoader.ImGui.isItemHovered()){
                    this.ModLoader.ImGui.beginTooltip();
                    this.ModLoader.ImGui.text("Hotkey: Spacebar")
                    this.ModLoader.ImGui.endTooltip();
                }
                this.ModLoader.ImGui.sameLine();
                
                if (this.ModLoader.ImGui.button("Unsplit")){
                    this.laps.pop();
                }
                //Tooltip for Unsplit
                if (this.ModLoader.ImGui.isItemHovered()){
                    this.ModLoader.ImGui.beginTooltip();
                    this.ModLoader.ImGui.text("Hotkey: Backspace")
                    this.ModLoader.ImGui.endTooltip();
                }
                }
                if(this.ModLoader.ImGui.collapsingHeader("Routes", TreeNodeFlags.DefaultOpen + TreeNodeFlags.Framed + TreeNodeFlags.FramePadding)){

                if(this.ModLoader.ImGui.button("Make a Custom Route", xy(305.5, 25))){
                    this.singleLine1 = [""]
                    this.multiLine1 = [""]
                    this.isCategorySetupOpen[0] = true;
                }
                if (this.ModLoader.ImGui.beginTabBar("Routes", TabBarFlags.AutoSelectNewTabs)){
                    for(let keyIndex = 0; keyIndex < (Object.keys(this.config) as string[]).length; keyIndex++){
                        const categoryName: string = Object.keys(this.config)[keyIndex] as string;
                        this.categoryName = categoryName;
                        if (this.ModLoader.ImGui.beginTabItem(categoryName)){
                            this.ModLoader.ImGui.beginChild("Columns", xy(305,columnResizeY), undefined);
                            this.ModLoader.ImGui.columns(2);
                                for(let index = 0; index < (this.config[categoryName] as string[]).length; index++){
                                    this.ModLoader.ImGui.text(this.config[categoryName][index] as string);
                                }
                                    this.ModLoader.ImGui.nextColumn();
                                    for(let i = 0; i < this.laps.length; i++){
                                        this.ModLoader.ImGui.text(this.parseTime(this.laps[i]));
                                    }
                            this.ModLoader.ImGui.endChild();
                            this.ModLoader.ImGui.endTabItem();
                        } 
                            
                    }          
                    this.ModLoader.ImGui.endTabBar();
                    this.ModLoader.ImGui.setCursorPosY(windowResizeHeight);
                    this.ModLoader.ImGui.setCursorPosX(this.ModLoader.ImGui.getWindowContentRegionWidth()/14);
                    if(this.ModLoader.ImGui.button("Delete Route", xy(135,25))){
                        this.isPopupOpen[0] = true;
                        this.isCategorySetupOpen[0] = false;
                    }
                    this.ModLoader.ImGui.sameLine();
                    if(this.ModLoader.ImGui.button("Edit Route", xy(135,25))){
                        this.isCategorySetupOpen[0] = true;
                        this.isPopupOpen[0] = false;
                        this.singleLine1[0] = this.categoryName;
                        this.multiLine1[0] = this.config[this.categoryName].join("\n");
                    }
                    if(this.ModLoader.ImGui.isItemHovered()){
                        this.ModLoader.ImGui.beginTooltip();
                        this.ModLoader.ImGui.text("Edit the currently selected route.");
                        this.ModLoader.ImGui.endTooltip();
                    }
                }
                }   
            }
            this.ModLoader.ImGui.popStyleVar();
            this.ModLoader.ImGui.popStyleColor(1);   
            this.ModLoader.ImGui.end();
        }
        if (this.isCategorySetupOpen[0]){
            this.ModLoader.ImGui.pushStyleVar(StyleVar.WindowBorderSize, 4);
            this.ModLoader.ImGui.begin("Custom Routes", this.isCategorySetupOpen, WindowFlags.NoResize + WindowFlags.NoDocking + WindowFlags.NoCollapse);
            let windowWidth2 = 425;
            let windowHeight2 = 320;
            this.ModLoader.ImGui.setWindowSize({x: windowWidth2, y: windowHeight2}, Cond.Always);
            this.ModLoader.ImGui.text("Category Name:");
            this.ModLoader.ImGui.sameLine();
            this.ModLoader.ImGui.inputText("##Category", this.singleLine1);
            this.ModLoader.ImGui.newLine();
            this.ModLoader.ImGui.text("Route:");
            this.ModLoader.ImGui.sameLine();
            this.ModLoader.ImGui.inputTextMultiline("##Routes", this.multiLine1, xy(340,170));
            if (this.ModLoader.ImGui.isItemHovered()){
                this.ModLoader.ImGui.beginTooltip();
                this.ModLoader.ImGui.text("Put your route here followed by enter for each line.");
                this.ModLoader.ImGui.endTooltip();
            }
            this.ModLoader.ImGui.newLine();
            if(this.ModLoader.ImGui.button("Make Route", xy(400,25))){
                this.setRoute(this.singleLine1[0], this.multiLine1[0].split('\n'));
                this.singleLine1[0] = "";
                this.multiLine1[0] = "";
                this.isCategorySetupOpen[0] = false;
                this.ModLoader.config.save();
            }
            this.ModLoader.ImGui.popStyleVar();
            this.ModLoader.ImGui.end();
        } 
        
        
        if (this.isPopupOpen[0]){
            this.ModLoader.ImGui.pushStyleVar(StyleVar.WindowBorderSize, 4);
            this.ModLoader.ImGui.begin("Confirmation", undefined, WindowFlags.NoResize + WindowFlags.NoDocking + WindowFlags.NoTitleBar);
            let windowWidth3 = 400;
            let windowHeight3 = 115;
            this.ModLoader.ImGui.setWindowSize({x: windowWidth3, y: windowHeight3}, Cond.Always)
            this.ModLoader.ImGui.text("          Are you sure you want to delete this Route?");
            this.ModLoader.ImGui.text("                        This process is irreversible.");
            this.ModLoader.ImGui.newLine();
            if(this.ModLoader.ImGui.button("Yes", xy(185,25))){
                delete this.config[this.categoryName];
                this.isPopupOpen[0] = false;
                this.ModLoader.config.save();
            
            }
            this.ModLoader.ImGui.sameLine();
            if (this.ModLoader.ImGui.button("No", xy(185,25))){
                this.isPopupOpen[0] = false;
            }
              
         this.ModLoader.ImGui.popStyleVar();
         this.ModLoader.ImGui.end();
        }
                
    }
}

module.exports = Split_Timer;