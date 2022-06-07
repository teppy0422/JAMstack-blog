import React, { useRef, useState, Link as Scroll } from "react";
import Content from "../../components/content";
import InfiniteScroll from "react-infinite-scroller";

import ImageGalley from "../../script/imageGalley";
import styles from "../../styles/home.module.scss";
import {
  Center,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  Stack,
  Box,
  VStack,
  StylesProvider,
  Badge,
} from "@chakra-ui/react";
import { Search2Icon, ChevronUpIcon } from "@chakra-ui/icons";

function searchPicture() {
  const [fetchData, setFetchData] = useState([]); //表示するデータ
  const [hasMore, setHasMore] = useState(true); //再読み込み判定
  const [hasPixabay, setHasPixabay] = useState(false);
  const [page, setPage] = useState(1); //ページのカウント
  const ref = useRef();
  const userKey_pixabay = "27877116-580ccd7d517cea5b043633ed8";
  const userKey_flickr = "48b0a5b3228baf7796f60e389e9c3397";

  const [total_pixabay, setTotalPixabay] = useState(0);
  const [total_flickr, setTotalFlickr] = useState(0);

  //検索時
  const handleSubmit = async (e) => {
    setPage(1);
    e.preventDefault();
    setHasPixabay(false);
    //APIURL
    const endpointURL = `https://pixabay.com/api/?key=${userKey_pixabay}&q=${ref.current.value}&image_type=photo&page=${page}&per_page=50`;
    const endpointURL_flickr = `https://api.flickr.com/services/rest?api_key=${userKey_flickr}&method=flickr.photos.search&format=json&nojsoncallback=1&text=${
      ref.current.value
    }&extras=url_s,url_o&per_page=50&page=${
      page - 1
    }&safe_search=1&license=9,10`;
    //APIを叩く(データフェッチング)
    fetch(endpointURL)
      //受け取ってjson化
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setTotalPixabay(data.totalHits);
        console.log(data.hits);
        setFetchData(data.hits);
      });

    fetch(endpointURL_flickr)
      //受け取ってjson化
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.photos.page >= data.photos.pages && hasPixabay === true) {
          setHasMore(false);
          return;
        }
        setTotalFlickr(data.photos.total);
      });
  };

  //リロード、スクロール時
  const loadMore = async (page) => {
    //APIURL
    setPage(setPage + 1);
    const endpointURL_pixabay = `https://pixabay.com/api/?key=${userKey_pixabay}&q=${ref.current.value}&image_type=photo&page=${page}&per_page=50`;
    const endpointURL_flickr = `https://api.flickr.com/services/rest?api_key=${userKey_flickr}&method=flickr.photos.search&format=json&nojsoncallback=1&text=${
      ref.current.value
    }&extras=url_s,url_o&per_page=50&page=${
      page - 1
    }&safe_search=1&license=9,10`;

    // APIを叩く(データフェッチング);
    fetch(endpointURL_pixabay)
      //受け取ってjson化
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data.hits);
        if (data.hits.length < 1) {
          setHasPixabay(true);
          return;
        }
        setTotalPixabay(data.total);
        setFetchData([...fetchData, ...data.hits]);
      });

    console.log("______");

    fetch(endpointURL_flickr)
      //受け取ってjson化
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.photos.page >= data.photos.pages && hasPixabay === true) {
          setHasMore(false);
          return;
        }
        setTotalFlickr(data.photos.total);
        setFetchData([...fetchData, ...data.photos.photo]);
      });
  };

  //ロード中に表示する項目
  const loader = (
    <div className="loader" key={0}>
      Loading ...
    </div>
  );
  //ページトップに移動
  const returnTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Content>
      <Box h={12} />
      <Stack style={{ textAlign: "center" }}>
        <Text style={{ fontSize: "24px" }}>画像検索</Text>
        <Text>商用利用無料 帰属表示は必要ありません</Text>
        <Center>
          <Stack direction="row">
            <Badge colorScheme="green">Pixabay={total_pixabay}</Badge>
            <Badge colorScheme="blue">flickr={total_flickr}</Badge>
          </Stack>
        </Center>
        <Box h={4} />

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

        <Center>
          <VStack
            w={13}
            position="relative"
            onClick={returnTop}
            className={styles.scrollTop}
          >
            <ChevronUpIcon w={12} h={12} m={0} p={0} />
            <ChevronUpIcon
              w={12}
              h={12}
              m={0}
              p={0}
              position="absolute"
              top="-20px"
            />
          </VStack>
        </Center>
      </Stack>
    </Content>
  );
}

export default searchPicture;
