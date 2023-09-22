import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

type Player = 'x' | 'o' | null;

const createEmptyTicTacToe = () => {
  const sizeX = 3; // Size in the X dimension
  const sizeY = 3; // Size in the Y dimension
  const sizeZ = 3; // Size in the Z dimension


  const ticTacToe: (null | any)[][][] = [];
  for (let x = 0; x < sizeX; x++) {
    ticTacToe[x] = []; // Initialize the next dimension
  
    for (let y = 0; y < sizeY; y++) {
      ticTacToe[x][y] = []; // Initialize the next dimension
  
      for (let z = 0; z < sizeZ; z++) {
        ticTacToe[x][y][z] = null; // Set each element to null
      }
    }
  }
  
  ticTacToe[1][1][1] = 'x'; //middle cube are not accessible, put value to avoid null

  return ticTacToe;
}

// Initialize a 3D array with all values as null
const initialBoard: (null | any)[][][] = createEmptyTicTacToe();

const Cube: React.FC<{ position: THREE.Vector3; value: Player | null; onCubeClick: () => void }> = ({
  position,
  value,
  onCubeClick,
}) => {
  return (
    <Box position={position} text={value} onClick={(event) => {
      event.stopPropagation();
      onCubeClick();
    }}/>
  );
};

function Box(props: JSX.IntrinsicElements['mesh'] & { text: string | null }): JSX.Element {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);

  const textPosition = [
    // Front face
    { position: new THREE.Vector3(0, 0, 0.501), rotation: new THREE.Euler(0, 0, 0) },

    // Back face
    { position: new THREE.Vector3(0, 0, -0.501), rotation: new THREE.Euler(0, Math.PI, 0) },

    // Right face
    { position: new THREE.Vector3(0.501, 0, 0), rotation: new THREE.Euler(0, Math.PI / 2, 0) },

    // Left face
    { position: new THREE.Vector3(-0.501, 0, 0), rotation: new THREE.Euler(0, -Math.PI / 2, 0) },

    // Top face
    { position: new THREE.Vector3(0, 0.501, 0), rotation: new THREE.Euler(-Math.PI / 2, 0, 0) },

    // Bottom face
    { position: new THREE.Vector3(0, -0.501, 0), rotation: new THREE.Euler(Math.PI / 2, 0, 0) },
  ];

  // Create edges geometry

  return (
  <group>
      <mesh
        {...props}
        ref={ref}
        onPointerOver={(event) => {
          event.stopPropagation();
          hover(true);
        }}
        onPointerOut={(_event) => hover(false)}
      >
        <boxGeometry args={[1, 1, 1]}/>
        <meshStandardMaterial color={hovered ? 'hotpink' : "lightgray"} />
        {/* Text on All Six Faces */}
        {textPosition.map((positionData, index) => (
          <Text
            key={index}
            position={positionData.position.toArray()}
            rotation={positionData.rotation}
            color="black"
            fontSize={1}
          >
            {props.text}
          </Text>
        ))}
      </mesh>
    </group>
  );
}

const calculateWinner = (cubes: Player[][][]): number[] => {
  const lines = [
    //face 1
    [[0, 0, 0], [0, 1, 0], [0, 2, 0]],
    [[0, 0, 1], [0, 1, 1], [0, 2, 1]],
    [[0, 0, 2], [0, 1, 2], [0, 2, 2]],
    [[0, 0, 0], [0, 0, 1], [0, 0, 2]],
    [[0, 1, 0], [0, 1, 1], [0, 1, 2]],
    [[0, 2, 0], [0, 2, 1], [0, 2, 2]],
    [[0, 0, 0], [0, 1, 1], [0, 2, 2]],
    [[0, 0, 2], [0, 1, 1], [0, 2, 0]],

    //face 2
    [[2, 0, 0], [2, 1, 0], [2, 2, 0]],
    [[2, 0, 1], [2, 1, 1], [2, 2, 1]],
    [[2, 0, 2], [2, 1, 2], [2, 2, 2]],
    [[2, 0, 0], [2, 0, 1], [2, 0, 2]],
    [[2, 1, 0], [2, 1, 1], [2, 1, 2]],
    [[2, 2, 0], [2, 2, 1], [2, 2, 2]],
    [[2, 0, 0], [2, 1, 1], [2, 2, 2]],
    [[2, 0, 2], [2, 1, 1], [2, 2, 0]],

    //face 3
    [[0, 0, 0], [1, 0, 0], [2, 0, 0]],
    [[0, 0, 1], [1, 0, 1], [2, 0, 1]],
    [[0, 0, 2], [1, 0, 2], [2, 0, 2]],
    [[0, 0, 0], [0, 0, 1], [0, 0, 2]],
    [[1, 0, 0], [1, 0, 1], [1, 0, 2]],
    [[2, 0, 0], [2, 0, 1], [2, 0, 2]],
    [[0, 0, 0], [1, 0, 1], [2, 0, 2]],
    [[0, 0, 2], [1, 0, 1], [2, 0, 0]],

    //face 4
    [[0, 2, 0], [1, 2, 0], [2, 2, 0]],
    [[0, 2, 1], [1, 2, 1], [2, 2, 1]],
    [[0, 2, 2], [1, 2, 2], [2, 2, 2]],
    [[0, 2, 0], [0, 2, 1], [0, 2, 2]],
    [[1, 2, 0], [1, 2, 1], [1, 2, 2]],
    [[2, 2, 0], [2, 2, 1], [2, 2, 2]],
    [[0, 2, 0], [1, 2, 1], [2, 2, 2]],
    [[0, 2, 2], [1, 2, 1], [2, 2, 0]],

    //face 5
    [[0, 0, 0], [1, 0, 0], [2, 0, 0]],
    [[0, 1, 0], [1, 1, 0], [2, 1, 0]],
    [[0, 2, 0], [1, 2, 0], [2, 2, 0]],
    [[0, 0, 0], [0, 1, 0], [0, 2, 0]],
    [[1, 0, 0], [1, 1, 0], [1, 2, 0]],
    [[2, 0, 0], [2, 1, 0], [2, 2, 0]],
    [[0, 0, 0], [1, 1, 0], [2, 2, 0]],
    [[0, 2, 0], [1, 1, 0], [2, 0, 0]],

    //face 6
    [[0, 0, 2], [1, 0, 2], [2, 0, 2]],
    [[0, 1, 2], [1, 1, 2], [2, 1, 2]],
    [[0, 2, 2], [1, 2, 2], [2, 2, 2]],
    [[0, 0, 2], [0, 1, 2], [0, 2, 2]],
    [[1, 0, 2], [1, 1, 2], [1, 2, 2]],
    [[2, 0, 2], [2, 1, 2], [2, 2, 2]],
    [[0, 0, 2], [1, 1, 2], [2, 2, 2]],
    [[0, 2, 2], [1, 1, 2], [2, 0, 2]],
  ]

  let xLines = 0;
  let oLines = 0;

  for (const [a, b, c] of lines) {
    if (
      cubes[a[0]][a[1]][a[2]] &&
      cubes[a[0]][a[1]][a[2]] === cubes[b[0]][b[1]][b[2]] &&
      cubes[a[0]][a[1]][a[2]] === cubes[c[0]][c[1]][c[2]]
    ) {
      if (cubes[a[0]][a[1]][a[2]] =='x'){
        xLines += 1;
      } else {
        oLines += 1;
      }
    }
  }

  return [xLines, oLines];
}

const Board: React.FC<{
  xIsNext: boolean;
  cubes: Player[][][];
  onPlay: (nextCubes: Player[][][]) => void;
}> = ({ xIsNext, cubes, onPlay }) => {
  const handleClick = (x: number, y: number, z: number) => {
    if (cubes[x][y][z]) {
      return;
    }
    const nextCubes = cubes.slice();

    if (xIsNext) {
      nextCubes[x][y][z] = 'x';
    } else {
      nextCubes[x][y][z] = 'o';
    }
    onPlay(nextCubes);
  };

  return (
    <div className="Cube">
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Cube position={new THREE.Vector3(-1, -1, -1)} value={cubes[0][0][0]} onCubeClick={() => handleClick(0, 0, 0)} />
        <Cube position={new THREE.Vector3(-1, -1,  0)} value={cubes[0][0][1]} onCubeClick={() => handleClick(0, 0, 1)} />
        <Cube position={new THREE.Vector3(-1, -1,  1)} value={cubes[0][0][2]} onCubeClick={() => handleClick(0, 0, 2)} />
        <Cube position={new THREE.Vector3(-1,  0, -1)} value={cubes[0][1][0]} onCubeClick={() => handleClick(0, 1, 0)} />
        <Cube position={new THREE.Vector3(-1,  0,  0)} value={cubes[0][1][1]} onCubeClick={() => handleClick(0, 1, 1)} />
        <Cube position={new THREE.Vector3(-1,  0,  1)} value={cubes[0][1][2]} onCubeClick={() => handleClick(0, 1, 2)} />
        <Cube position={new THREE.Vector3(-1,  1, -1)} value={cubes[0][2][0]} onCubeClick={() => handleClick(0, 2, 0)} />
        <Cube position={new THREE.Vector3(-1,  1,  0)} value={cubes[0][2][1]} onCubeClick={() => handleClick(0, 2, 1)} />
        <Cube position={new THREE.Vector3(-1,  1,  1)} value={cubes[0][2][2]} onCubeClick={() => handleClick(0, 2, 2)} />
        <Cube position={new THREE.Vector3( 0, -1, -1)} value={cubes[1][0][0]} onCubeClick={() => handleClick(1, 0, 0)} />
        <Cube position={new THREE.Vector3( 0, -1,  0)} value={cubes[1][0][1]} onCubeClick={() => handleClick(1, 0, 1)} />
        <Cube position={new THREE.Vector3( 0, -1,  1)} value={cubes[1][0][2]} onCubeClick={() => handleClick(1, 0, 2)} />
        <Cube position={new THREE.Vector3( 0,  0, -1)} value={cubes[1][1][0]} onCubeClick={() => handleClick(1, 1, 0)} />

        <Cube position={new THREE.Vector3( 0,  0,  1)} value={cubes[1][1][2]} onCubeClick={() => handleClick(1, 1, 2)} />
        <Cube position={new THREE.Vector3( 0,  1, -1)} value={cubes[1][2][0]} onCubeClick={() => handleClick(1, 2, 0)} />
        <Cube position={new THREE.Vector3( 0,  1,  0)} value={cubes[1][2][1]} onCubeClick={() => handleClick(1, 2, 1)} />
        <Cube position={new THREE.Vector3( 0,  1,  1)} value={cubes[1][2][2]} onCubeClick={() => handleClick(1, 2, 2)} />
        <Cube position={new THREE.Vector3( 1, -1, -1)} value={cubes[2][0][0]} onCubeClick={() => handleClick(2, 0, 0)} />
        <Cube position={new THREE.Vector3( 1, -1,  0)} value={cubes[2][0][1]} onCubeClick={() => handleClick(2, 0, 1)} />
        <Cube position={new THREE.Vector3( 1, -1,  1)} value={cubes[2][0][2]} onCubeClick={() => handleClick(2, 0, 2)} />
        <Cube position={new THREE.Vector3( 1,  0, -1)} value={cubes[2][1][0]} onCubeClick={() => handleClick(2, 1, 0)} />
        <Cube position={new THREE.Vector3( 1,  0,  0)} value={cubes[2][1][1]} onCubeClick={() => handleClick(2, 1, 1)} />
        <Cube position={new THREE.Vector3( 1,  0,  1)} value={cubes[2][1][2]} onCubeClick={() => handleClick(2, 1, 2)} />
        <Cube position={new THREE.Vector3( 1,  1, -1)} value={cubes[2][2][0]} onCubeClick={() => handleClick(2, 2, 0)} />
        <Cube position={new THREE.Vector3( 1,  1,  0)} value={cubes[2][2][1]} onCubeClick={() => handleClick(2, 2, 1)} />
        <Cube position={new THREE.Vector3( 1,  1,  1)} value={cubes[2][2][2]} onCubeClick={() => handleClick(2, 2, 2)} />
        <OrbitControls/>
      </Canvas>
  </div>
  );
};

function hasNullValue(array3D: (null | any)[][][]): boolean {
  for (let x = 0; x < array3D.length; x++) {
    for (let y = 0; y < array3D[x].length; y++) {
      for (let z = 0; z < array3D[x][y].length; z++) {
        if (array3D[x][y][z] === null) {
          return true; // Found a null value
        }
      }
    }
  }
  return false; // No null values found
}

const Game: React.FC = () => {
  const [currentMove, setCurrentMove] = useState<number>(0);
  const xIsNext: boolean = currentMove % 2 === 0;
  const [currentCubes, setCurrentCubes] = useState<Player[][][]>(initialBoard);
  const hasNull = hasNullValue(currentCubes);

  console.log(hasNull);

  const winCounts = calculateWinner(currentCubes);

  let xWins: string = "X wins: " + winCounts[0];
  let oWins: string = "O wins: " + winCounts[1];
  let status: string;
  if (hasNull){
    status = "\nNext Player: " + (xIsNext ? 'x' : 'o');
  } else {
    status = "\nWinner is: " + (winCounts[0] > winCounts[1] ? 'x' : 'o');
  }

  const handlePlay = (nextCubes: Player[][][]) => {
    setCurrentCubes(nextCubes);
    setCurrentMove(currentMove + 1);
  };

  const restart = () => {
    setCurrentCubes(createEmptyTicTacToe());
  }

  return (
    <>
      <div className='game'>
        <div className='status'>
          <h1>{status}</h1>
          <ul>
            <li>{xWins}</li>
            <li>{oWins}</li>
          </ul>
        </div>
        <Board xIsNext={xIsNext} cubes={currentCubes} onPlay={handlePlay} />
        <br/>
        <button onClick={restart}>Restart</button>
      </div>
    </>
  );
};

export default Game;