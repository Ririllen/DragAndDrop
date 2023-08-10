import React, { useRef } from "react";
import styles from "./imageList.module.css";
// import useDrag and useDrop hooks from react-dnd
import { useDrag, useDrop } from "react-dnd";

// Rendering individual images
const type = "Image"; // Need to pass which type element can be draggable, its a simple string or Symbol. This is like an Unique ID so that the library know what type of element is dragged or dropped on.

const Image = ({ image, index, moveImage, images, setImages}) => {
  const ref = useRef(null); // Initialize the reference

  // useDrop hook is responsible for handling whether any item gets hovered or dropped on the element
  const [, drop] = useDrop({
    // Accept will make sure only these element type can be droppable on this element
    accept: type,
    hover(item) {
        if (!ref.current) {
            return;
          }
          const dragIndex = item.index;
          // current element where the dragged element is hovered on
          const hoverIndex = index;
          // If the dragged element is hovered in the same place, then do nothing
          if (dragIndex === hoverIndex) { 
            return;
          }
          // If it is dragged around other elements, then move the image and set the state with position changes
          moveImage(images, setImages, dragIndex, hoverIndex);
          /*
            Update the index for dragged item directly to avoid flickering
            when the image was half dragged into the next
          */
          item.index = hoverIndex;
    }
  });

  // useDrag will be responsible for making an element draggable. It also expose, isDragging method to add any styles while dragging
  const [{ isDragging }, drag] = useDrag(() => ({
    // what type of item this to determine if a drop target accepts it
    type: type,
    // data of the item to be available to the drop methods
    item: { id: image.id, index },
    // method to collect additional data for drop handling like whether is currently being dragged
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  }));

  /* 
    Initialize drag and drop into the element using its reference.
    Here we initialize both drag and drop on the same element (i.e., Image component)
  */
  drag(drop(ref));

  // Add the reference to the element
  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0 : 1 }}
      className="file-item"
    >
      <img alt={`img - ${image.id}`} src={image.src} className="file-img" />
    </div>
  );
};

// ImageList Component
const ImageList = ({ images, setImages, moveImage }) => {
    const renderImage = (image, index) => {
      return image ? (
        <Image
          image={image}
          index={index}
          key={`${image.id}-image`}
          moveImage={moveImage}
          images={images}
          setImages={setImages}
        />
      ): null;
    };
    return <section className={styles.file_list}>{images.map(renderImage)}</section>;
}   
  
  export default ImageList;