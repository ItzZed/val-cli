// Argument Handler, when the cli has an argument it will be parsed and the variables/booleans will be toggled here.

// ARGUMENT TOGGLES
// TRUE = ON, FALSE = OFF
let setupMode = false; // Overwritten by config if is true.


// A lot of duplicates to support users entering different names for arguments. (user-friendly nonsense)
let args = {
	"setup": setupMode,
	"--setup": setupMode,
	"config": setupMode,
	"--config": setupMode,
	"configure": setupMode,
	"--configure": setupMode
};

