import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";

const Preview = ({ img }) => {
  const reader = new FileReader();
  const file = img;

  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        console.log(reader.result);
        setImgSrc(reader.result);
      };
    }
  });

  return (
    <div>
      <PreviewImage src={imgSrc} />
    </div>
  );
};

export default Preview;

const PreviewImage = styled.img`
  /* position: absolute; */
  height: 80px;
  width: 80px;
`;
