// src/components/JapanMap.tsx
'use client';

import { Box, useColorMode, Text } from '@chakra-ui/react';
import { useState } from 'react';

interface JapanMapProps {
  selected?: string[]; // ['hokkaido', 'tokyo', 'osaka']
  colorMap?: { [key: string]: string }; // { tokyo: '#FF0000' }
  width?: string;
  height?: string;
}

// 簡易版の都道府県パスデータ（実際にはもっと詳細なデータを使用）
// 注: これは実際の地図データではなく、デモ用の簡易版です
const PREFECTURE_PATHS: { [key: string]: { name: string; path: string; label: [number, number] } } = {
  hokkaido: {
    name: '北海道',
    path: 'M340,40 L380,35 L420,45 L450,60 L470,90 L460,130 L430,150 L390,155 L350,145 L320,120 L310,85 L320,60 Z',
    label: [390, 95]
  },
  aomori: {
    name: '青森',
    path: 'M370,160 L390,155 L410,160 L415,180 L405,195 L385,190 L375,175 Z',
    label: [395, 175]
  },
  iwate: {
    name: '岩手',
    path: 'M405,195 L420,190 L430,210 L425,245 L410,250 L400,230 L395,210 Z',
    label: [415, 220]
  },
  miyagi: {
    name: '宮城',
    path: 'M395,240 L410,250 L415,265 L405,275 L390,270 L385,255 Z',
    label: [400, 260]
  },
  fukushima: {
    name: '福島',
    path: 'M385,275 L405,280 L410,305 L400,320 L380,315 L375,290 Z',
    label: [395, 300]
  },
  ibaraki: {
    name: '茨城',
    path: 'M400,320 L415,325 L420,345 L410,355 L395,350 L390,330 Z',
    label: [405, 340]
  },
  tochigi: {
    name: '栃木',
    path: 'M375,315 L390,310 L400,325 L395,340 L380,335 Z',
    label: [388, 327]
  },
  gunma: {
    name: '群馬',
    path: 'M360,310 L375,305 L385,320 L380,335 L365,330 Z',
    label: [373, 320]
  },
  saitama: {
    name: '埼玉',
    path: 'M365,330 L380,335 L385,350 L375,360 L360,355 Z',
    label: [373, 345]
  },
  chiba: {
    name: '千葉',
    path: 'M385,350 L400,355 L410,370 L405,385 L390,380 L380,365 Z',
    label: [395, 370]
  },
  tokyo: {
    name: '東京',
    path: 'M370,350 L385,355 L390,370 L380,380 L365,375 Z',
    label: [378, 365]
  },
  kanagawa: {
    name: '神奈川',
    path: 'M360,375 L375,380 L380,395 L370,405 L355,400 Z',
    label: [368, 390]
  },
  yamanashi: {
    name: '山梨',
    path: 'M345,345 L360,350 L365,365 L355,375 L340,370 Z',
    label: [353, 360]
  },
  nagano: {
    name: '長野',
    path: 'M320,320 L340,315 L355,330 L360,350 L350,365 L330,360 L315,340 Z',
    label: [340, 340]
  },
  niigata: {
    name: '新潟',
    path: 'M340,280 L360,275 L375,290 L370,310 L355,315 L340,300 Z',
    label: [358, 295]
  },
  toyama: {
    name: '富山',
    path: 'M310,300 L325,295 L335,310 L330,325 L315,320 Z',
    label: [323, 310]
  },
  ishikawa: {
    name: '石川',
    path: 'M295,295 L310,290 L320,305 L315,320 L300,315 Z',
    label: [308, 305]
  },
  fukui: {
    name: '福井',
    path: 'M300,315 L315,320 L320,335 L310,345 L295,340 Z',
    label: [308, 330]
  },
  shizuoka: {
    name: '静岡',
    path: 'M340,370 L360,375 L370,390 L365,410 L345,405 L330,385 Z',
    label: [350, 390]
  },
  aichi: {
    name: '愛知',
    path: 'M310,365 L330,370 L340,385 L335,400 L315,395 Z',
    label: [323, 383]
  },
  gifu: {
    name: '岐阜',
    path: 'M305,340 L325,345 L335,360 L325,375 L305,370 Z',
    label: [318, 358]
  },
  mie: {
    name: '三重',
    path: 'M315,395 L335,400 L340,420 L330,435 L310,430 Z',
    label: [323, 415]
  },
  shiga: {
    name: '滋賀',
    path: 'M290,360 L305,365 L310,380 L300,390 L285,385 Z',
    label: [298, 375]
  },
  kyoto: {
    name: '京都',
    path: 'M285,385 L300,390 L305,405 L295,415 L280,410 Z',
    label: [293, 400]
  },
  osaka: {
    name: '大阪',
    path: 'M285,410 L300,415 L305,430 L295,440 L280,435 Z',
    label: [293, 425]
  },
  hyogo: {
    name: '兵庫',
    path: 'M260,395 L280,400 L290,415 L285,435 L265,430 Z',
    label: [275, 415]
  },
  nara: {
    name: '奈良',
    path: 'M295,430 L310,435 L315,450 L305,460 L290,455 Z',
    label: [303, 445]
  },
  wakayama: {
    name: '和歌山',
    path: 'M285,455 L305,460 L310,480 L300,495 L280,490 Z',
    label: [293, 473]
  },
  tottori: {
    name: '鳥取',
    path: 'M230,390 L250,385 L265,400 L260,415 L240,410 Z',
    label: [248, 400]
  },
  shimane: {
    name: '島根',
    path: 'M200,395 L220,390 L235,405 L230,425 L210,420 Z',
    label: [218, 408]
  },
  okayama: {
    name: '岡山',
    path: 'M245,415 L265,420 L270,435 L260,450 L240,445 Z',
    label: [253, 433]
  },
  hiroshima: {
    name: '広島',
    path: 'M215,425 L240,430 L250,445 L240,465 L215,460 Z',
    label: [230, 445]
  },
  yamaguchi: {
    name: '山口',
    path: 'M180,445 L205,450 L215,465 L205,485 L180,480 Z',
    label: [198, 465]
  },
  tokushima: {
    name: '徳島',
    path: 'M275,465 L295,470 L300,485 L290,500 L270,495 Z',
    label: [283, 483]
  },
  kagawa: {
    name: '香川',
    path: 'M255,450 L270,455 L275,470 L265,480 L250,475 Z',
    label: [263, 465]
  },
  ehime: {
    name: '愛媛',
    path: 'M220,465 L240,470 L245,490 L235,505 L215,500 Z',
    label: [230, 485]
  },
  kochi: {
    name: '高知',
    path: 'M235,505 L255,510 L265,530 L255,550 L235,545 Z',
    label: [248, 528]
  },
  fukuoka: {
    name: '福岡',
    path: 'M150,465 L175,470 L185,490 L175,505 L150,500 Z',
    label: [165, 485]
  },
  saga: {
    name: '佐賀',
    path: 'M135,490 L155,495 L160,510 L150,520 L130,515 Z',
    label: [145, 505]
  },
  nagasaki: {
    name: '長崎',
    path: 'M110,505 L135,510 L140,530 L130,545 L105,540 Z',
    label: [123, 525]
  },
  kumamoto: {
    name: '熊本',
    path: 'M150,520 L175,525 L185,545 L175,565 L150,560 Z',
    label: [165, 543]
  },
  oita: {
    name: '大分',
    path: 'M175,505 L200,510 L210,530 L200,545 L175,540 Z',
    label: [190, 525]
  },
  miyazaki: {
    name: '宮崎',
    path: 'M185,545 L210,550 L220,575 L210,595 L185,590 Z',
    label: [203, 570]
  },
  kagoshima: {
    name: '鹿児島',
    path: 'M155,575 L180,580 L190,605 L180,625 L155,620 Z',
    label: [170, 600]
  },
  okinawa: {
    name: '沖縄',
    path: 'M120,680 L140,675 L150,690 L145,705 L125,700 Z',
    label: [135, 690]
  },
};

export const JapanMap = ({
  selected = [],
  colorMap = {},
  width = '100%',
  height = 'auto'
}: JapanMapProps) => {
  const { colorMode } = useColorMode();
  const [hovered, setHovered] = useState<string | null>(null);

  const getColor = (prefId: string) => {
    if (colorMap[prefId]) return colorMap[prefId];
    if (selected.includes(prefId)) return '#DD6B20';
    return colorMode === 'light' ? '#E2E8F0' : '#2D3748';
  };

  const getStrokeColor = () => {
    return colorMode === 'light' ? '#2D3748' : '#E2E8F0';
  };

  return (
    <Box width={width} height={height} maxW="600px" mx="auto" my={4}>
      <svg
        viewBox="0 0 600 750"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* 都道府県を描画 */}
        {Object.entries(PREFECTURE_PATHS).map(([prefId, data]) => (
          <g key={prefId}>
            <path
              id={prefId}
              d={data.path}
              fill={getColor(prefId)}
              stroke={getStrokeColor()}
              strokeWidth="1"
              opacity={hovered === prefId ? 0.7 : 1}
              cursor="pointer"
              onMouseEnter={() => setHovered(prefId)}
              onMouseLeave={() => setHovered(null)}
              style={{
                transition: 'all 0.2s ease',
              }}
            />
            {/* ホバー時に都道府県名を表示 */}
            {hovered === prefId && (
              <text
                x={data.label[0]}
                y={data.label[1]}
                textAnchor="middle"
                fontSize="10"
                fill={colorMode === 'light' ? '#000' : '#fff'}
                fontWeight="bold"
                pointerEvents="none"
              >
                {data.name}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* 凡例 */}
      {selected.length > 0 && (
        <Box mt={2} fontSize="sm" color={colorMode === 'light' ? 'gray.700' : 'gray.300'}>
          <Text fontWeight="bold" mb={1}>選択された都道府県:</Text>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {selected.map((prefId) => (
              <Box
                key={prefId}
                px={2}
                py={1}
                borderRadius="md"
                bg={colorMap[prefId] || '#DD6B20'}
                color="white"
                fontSize="xs"
              >
                {PREFECTURE_PATHS[prefId]?.name || prefId}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
