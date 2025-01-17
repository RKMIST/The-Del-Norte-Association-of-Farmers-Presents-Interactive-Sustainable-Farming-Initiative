let controls;
let worldLayer;
let corn = 0;
let eco = 0;

// Register Leaderboard as a GameObjectFactory
Phaser.GameObjects.GameObjectFactory.register('World', function () {
    var scene = new World();
    this.scene.add(scene.scene.key, scene);
    return scene;
});

// Define Leaderboard class
class World extends Phaser.Scene {
    constructor() {
        super('World');
    }
  
preload() {
    
    this.load.image("tiles", "../assets/tilesets/farm-map.png");
    // this.load.image("farmTiles", "../assets/tilesets/farm-tileset.png");
    this.load.tilemapTiledJSON("map", "../assets/tilemaps/testMap2.json");
    
    
  }
  
create() {
    const map = this.make.tilemap({ key: "map" });
        
    // Handle Enter key press
    this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.keyEnter.on('down', function (key, event) { this.clickContinue(); }, this);
    
    // Fade in camera
    this.cameras.main.fadeIn(250, 0, 0, 0);


    // const tileset = map.addTilesetImage("tiles");
    const tileset = map.addTilesetImage("farm-map","tiles");
    // const farmTileset = map.addTilesetImage("farm-tileset","farmTiles");
    

    // // Parameters: layer name (or index) from Tiled, tileset, x, y
    worldLayer = map.createLayer("Tile Layer 1", tileset, 0, 0);
    // farmLayer = map.createLayer("Tile Layer 2", farmTileset, 0, 0);
    

  
    // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;
  
    // Set up the arrows to control the camera
    const cursors = this.input.keyboard.createCursorKeys();
    controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: camera,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5,
    });
  
    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  }

  clickContinue() {
    // Play click sound and fade out scene
    EPT.Sfx.play('click');
    EPT.fadeOutScene('MainMenu', this);
  }
  
  
update(time, delta) {
    // Apply the controls to the camera each update tick of the game
    controls.update(delta);
    // console.log(time);
    // Convert the mouse position to world position within the camera
    const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
    
    // Draw tiles (only within the groundLayer)
    if (this.input.manager.activePointer.isDown) {
      worldLayer.putTileAtWorldXY(133, worldPoint.x, worldPoint.y);
    }
    
    
    // Function to generate a unique growth state tile
    function generateUniqueGrowthStateTile() {
      // Generate a random number within a specific range
      const randomNum = Phaser.Math.Between(1, 100);
      
      // Assign a specific growth state tile based on the random number
      if (randomNum <= 25) {
        return 1; // Growth state 1
      } else if (randomNum <= 50) {
        return 2; // Growth state 2
      } else if (randomNum <= 75) {
        return 3; // Growth state 3
      } else {
        return 4; // Growth state 4
      }
    }


    // Execute the code every 3 seconds
    setInterval(() => {
      // determining all tiles that are 37 
      worldLayer.forEachTile(function(tile) {
        if (tile.index === 133) {          
          // Update World layer
          console.log("update");
          worldLayer.putTileAt(145, tile.x, tile.y);
          corn += 10*generateUniqueGrowthStateTile();
          eco = 1;
        }
      });
    }, 5000);

    // New Time Event
    // Execute the code every 3 seconds
    setInterval(() => {
      // determining all tiles that are 145 
      worldLayer.forEachTile(function(tile) {
        if (tile.index === 145) {
          // Update World layer
          console.log("update");
          worldLayer.putTileAt(887, tile.x, tile.y);
          corn += 10*generateUniqueGrowthStateTile();
          eco = 1;
        }
      });
    }, 8000);

    // New Time Event
    // Execute the code every 3 seconds
    setInterval(() => {
      // determining all tiles that are 887 
      worldLayer.forEachTile(function(tile) {
        if (tile.index === 887) {
          // Update World layer
          console.log("update");
          worldLayer.putTileAt(853, tile.x, tile.y);
          corn += 20*generateUniqueGrowthStateTile();
          eco = 1;
        }
      });
    }, 11000);
    
  }

}

  setInterval(() => {
    let email = localStorage.getItem("Email");
    let cropQuantity = corn;
    const data = {
      email,
      cropQuantity,
    };

    fetch('http://localhost:6942/api/person/cropQuantityUpdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.ok) {
          // Handle successful login
          console.log('Crop Update successful');

        } else {
          // Handle login error
          console.log('Crop Update failed');
        }
      })
      .catch(error => {
        // Handle network error
        console.log('Network error');
      });

    let data2 = {
      email,
      eco,
    }

    fetch('http://localhost:6942/api/person/ecoUpdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data2),
    })
      .then(response => {
        if (response.ok) {
          // Handle successful login
          console.log('Eco Update Successful');

        } else {
          // Handle login error
          console.log('Eco Update Failed');
        }
      })
      .catch(error => {
        // Handle network error
        console.log('Network error');
      });
  }, 10000);
