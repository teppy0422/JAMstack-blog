import React, { useRef, useState } from "react";
import Content from "../../components/content";
import ImageGalley from "../../script/imageGalley";

import {
  Center,
  Text,
  InputGroup,
  InputLeftAddon,
  Input,
  Stack,
  Box,
} from "@chakra-ui/react";

function searchPicture() {
  const [fetchData, setFetchData] = useState([]);
  const ref = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //APIURL
    const endpointURL = `https://pixabay.com/api/?key=27877116-580ccd7d517cea5b043633ed8&q=${ref.current.value}&image_type=photo&page=2`;
    //APIを叩く(データフェッチング)
    fetch(endpointURL)
      //受け取ってjson化
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // setFetchData(data);
        console.log(data.hits);
        setFetchData(data.hits);
      });
  };
  return (
    <Content>
      <Box h={16} />
      <Stack style={{ textAlign: "center" }}>
        <Text style={{ fontSize: "24px" }}>Pixabay clone</Text>
        <Box h={8} />

        <form onSubmit={(e) => handleSubmit(e)}>
          <InputGroup size="lg" borderColor="gray">
            <InputLeftAddon children="画像検索" />
            <Input type="text" placeholder="検索する文字を入力..." ref={ref} />
          </InputGroup>
        </form>
        <Box h="32px" />
        <ImageGalley fetchData={fetchData} />

        <Box h="50vh" />
      </Stack>
    </Content>
  );
}

export default searchPicture;
