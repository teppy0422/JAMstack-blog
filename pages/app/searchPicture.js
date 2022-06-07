import React, { useRef, useState } from "react";
import Content from "../../components/content";
import InfiniteScroll from "react-infinite-scroller";

import ImageGalley from "../../script/imageGalley";

import {
  Center,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  Stack,
  Box,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

function searchPicture() {
  const [fetchData, setFetchData] = useState([]); //表示するデータ
  const [hasMore, setHasMore] = useState(true); //再読み込み判定
  const [page, setPage] = useState(1); //ページのカウント
  const ref = useRef();
  const userKey = "27877116-580ccd7d517cea5b043633ed8";

  const handleSubmit = async (e) => {
    e.preventDefault();
    //APIURL
    const endpointURL = `https://pixabay.com/api/?key=${userKey}&q=${ref.current.value}&image_type=photo&page=1&per_page=50`;
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

  const loadMore = async (page) => {
    //APIURL
    setPage = setPage + 1;
    const endpointURL = `https://pixabay.com/api/?key=${userKey}&q=${ref.current.value}&image_type=photo&page=${page}&per_page=50`;
    //APIを叩く(データフェッチング)
    fetch(endpointURL)
      //受け取ってjson化
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // setFetchData(data);
        console.log(data.hits);
        if (data.hits.length < 1) {
          setHasMore(false);
          loader = <Text>That's all.</Text>;
          return;
        }
        setFetchData([...fetchData, ...data.hits]);
      });
  };

  //ロード中に表示する項目
  const loader = (
    <div className="loader" key={0}>
      Loading ...
    </div>
  );
  return (
    <Content>
      <Box h={16} />
      <Stack style={{ textAlign: "center" }}>
        <Text style={{ fontSize: "24px" }}>Pixabay clone</Text>
        <Text>商用無料の画像を検索</Text>
        <Box h={8} />

        <form onSubmit={(e) => handleSubmit(e, 1)}>
          <InputGroup size="lg" borderColor="gray">
            <InputLeftElement
              pointerEvents="none"
              children={<Search2Icon color="gray" />}
            />
            <Input type="text" placeholder="検索する文字を入力..." ref={ref} />
          </InputGroup>
        </form>
        <Box h="32px" />
        <InfiniteScroll
          loadMore={loadMore} //項目を読み込む際に処理するコールバック関数
          hasMore={hasMore} //読み込みを行うかどうかの判定
          loader={loader} //読み込み最中に表示する項目
        >
          <ImageGalley fetchData={fetchData} />
        </InfiniteScroll>
        <Box h="50vh" />
      </Stack>
    </Content>
  );
}

export default searchPicture;
