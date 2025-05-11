"use client";

import React, { useRef, useState, Link as Scroll } from "react";
import Content from "../../components/content";
import InfiniteScroll from "react-infinite-scroller";

import ImageGalley from "./parts/imageGalley";
import styles from "@/styles/home.module.scss";
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

export default function SearchPicture() {
  const [fetchData, setFetchData] = useState([]); //表示するデータ
  const [hasMore, setHasMore] = useState(true); //再読み込み判定
  const [hasPixabay, setHasPixabay] = useState(false);
  const [page, setPage] = useState(0); //ページのカウント
  const ref = useRef();
  const [usePixabay, setUsePixabay] = useState(true);
  const [useFlickr, setUseFlickr] = useState(false);
  const userKey_pixabay = "27877116-580ccd7d517cea5b043633ed8";
  const userKey_flickr = "48b0a5b3228baf7796f60e389e9c3397";

  const [total_pixabay, setTotalPixabay] = useState(0);
  const [total_flickr, setTotalFlickr] = useState(0);

  //検索時
  const handleSubmit = async (e) => {
    setPage(1);
    e.preventDefault();
    setHasPixabay(false);
    setUseFlickr(true);
    //APIURL
    const endpointURL = `https://pixabay.com/api/?key=${userKey_pixabay}&q=${ref.current.value}&image_type=photo&page=${page}&per_page=50`;
    const endpointURL_flickr = `https://api.flickr.com/services/rest?api_key=${userKey_flickr}&method=flickr.photos.search&format=json&nojsoncallback=1&text=${
      ref.current.value
    }&extras=url_s,url_o&per_page=50&page=${
      page - 1
    }&safe_search=1&license=9,10`;

    if (usePixabay) {
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
    }

    if (useFlickr) {
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
    }
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
    if (usePixabay) {
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
    }

    if (useFlickr) {
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
    }
  };

  //ロード中に表示する項目
  const loader = (
    <div className="loader" key={0}>
      Loading ...
    </div>
  );
  //ページトップに移動
  const returnTop = () => {
    window.document.getElementById("search").focus();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Content isCustomHeader={true}>
      <Box h={8} />
      <Stack style={{ textAlign: "center" }}>
        <Text className={styles.mPlus} style={{ fontSize: "24px" }}>
          画像検索
        </Text>
        <Text>商用利用無料 帰属表示が不要な画像のみを検索。</Text>
        <Text>画像をクリックするとより高解像度でダウンロード可能です。</Text>
        <Center>
          <Stack direction="row">
            <Badge
              colorScheme="green"
              // className={styles.badge}
              // onClick={() => setUsePixabay(!usePixabay)}
            >
              Pixabay={total_pixabay}
            </Badge>
            <Badge
              colorScheme="blue"
              // className={styles.badge}
              // onClick={() => setUseFlickr(!useFlickr)}
            >
              flickr={total_flickr}
            </Badge>
          </Stack>
        </Center>
        <Box h={4} />

        <form onSubmit={(e) => handleSubmit(e, 1)}>
          <Center>
            <InputGroup
              size="lg"
              borderColor="gray"
              w={["100%", "510px", "510px", "510px"]}
            >
              <InputLeftElement
                pointerEvents="none"
                children={<Search2Icon color="gray" />}
              />
              <Input type="text" placeholder="検索..." ref={ref} id="search" />
            </InputGroup>
          </Center>
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
