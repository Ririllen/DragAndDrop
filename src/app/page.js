'use client'
import React, { useCallback, useState, useRef } from "react";
// Import the dropzone component
import Dropzone from "src/app/components/Dropzone.js";
import ImageList from "src/app/components/ImageList.js";
import styles from "src/app/page.module.css";
import cuid from "cuid";
// import useDrag and useDrop hooks from react-dnd
import { DndProvider } from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import update from "immutability-helper";

const moveImage = (images, setImages, dragIndex, hoverIndex) => {
  // Get the dragged element
  const draggedImage = images[dragIndex];
  /*
    - copy the dragged image before hovered element (i.e., [hoverIndex, 0, draggedImage])
    - remove the previous reference of dragged element (i.e., [dragIndex, 1])
    - here we are using this update helper method from immutability-helper package
  */
  setImages(
    update(images, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, draggedImage]]
    })
  );
};

// We will pass this function to ImageList and then to Image -> Quite a bit of props drilling, the code can be refactored and place all the state management in ImageList itself to avoid props drilling. It's an exercise for you :)

export default function Home() {
  // Create a state called images using useState hooks and pass the initial value as empty array
  const [images, setImages] = useState([]);

// onDrop function 
const onDrop = useCallback(acceptedFiles => {
  // Loop through accepted files
  acceptedFiles.map(file => {
    // Initialize FileReader browser API
    const reader = new FileReader();
    // onload callback gets called after the reader reads the file data
    reader.onload = function(e) {
      // add the image into the state. Since FileReader reading process is asynchronous, its better to get the latest snapshot state (i.e., prevState) and update it. 
      setImages(prevState => [
        ...prevState,
        { id: cuid(), src: e.target.result }
      ]);
    };
    // Read the file as Data URL (since we accept only images)
    reader.readAsDataURL(file);
    return file;
  });
}, []);

  return (
    <main className="flex flex-col items-center p-24">

      <h1 className={styles.heading}>Drag and Drop Example</h1>
      <Dropzone onDrop={onDrop} accept={{"image/*" :[]}} />
      <DndProvider backend={HTML5Backend}>
        <ImageList images={images} setImages={setImages} moveImage={moveImage}/>
      </DndProvider>  
    </main>
  )
}
