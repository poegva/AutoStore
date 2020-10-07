import React from "react";
import Box from "@material-ui/core/Box";

import BatteryChargingFullIcon from '@material-ui/icons/BatteryChargingFull';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import SvgIcon from "@material-ui/core/SvgIcon";

import CarouselBlock from "../components/blocks/CarouselBlock";
import ImageBlock from "../components/blocks/ImageBlock";
import TextBlock from "../components/blocks/TextBlock";
import PerksBlock from "../components/blocks/PerksBlock";
import ShowcaseBlock from "../components/blocks/ShowcaseBlock";
import hqdfront from '../public/hqdfront.png';
import hqdfront2 from '../public/hqdfront2.png';
import hqdfront3 from '../public/hqdfront3.png';
import imageblock from '../public/imageblock.jpg';
import imageblock2 from '../public/imageblock2.jpg';
import cigarettes from '../public/cigarettes.png';
import pineapple from "../public/pineapple.svg";


export default function Home() {
  return (
      <Box style={{backgroundColor: "white", width: "100%", maxWidth: "100%"}}>
          <CarouselBlock
              images={[hqdfront, hqdfront2, hqdfront3]}
              title="HQD"
              subtitle="Не просто электронная сигарета"
              buttonText="Купить"
              buttonLink="/shop"
          />
          <ImageBlock image={imageblock} />
          <TextBlock
              title={<text>300 затяжек <br /> в каждом девайсе</text>}
              subtitle="В одном HQD находится 1,25 мл жидкости с солевой крепостью 50 мг"
              padding={40}
              image={cigarettes}
              buttonText="В магазин"
              buttonLink="/shop"
          />
          <ImageBlock image={imageblock2} />
          <PerksBlock
              title="HQD - это просто и вкусно"
              perks={[
                  {
                      icon: <SvgIcon component={pineapple} viewBox="0 0 525 525" style={{fontSize: 60}} />,
                      iconColor: "gold",
                      title: "Много вкусов",
                      description: "У нас в магазине вы найдете самые редкие и яркие вкусы."
                  },
                  {
                      icon: <BatteryChargingFullIcon style={{fontSize: 60}} />,
                      iconColor: "lawnGreen",
                      title: "Одноразовый",
                      description: "Забудьте о зарядных устройствах, флаконе с жидкостью, сгоревшей вате и испарителях."
                  },
                  {
                      icon: <DriveEtaIcon style={{fontSize: 60}} />,
                      iconColor: "darkTurquoise",
                      title: "Доставка на дом",
                      description: "Выбирайте свой HQD и заказывайте на дом. Доставим в течение 2 дней."
                  }
              ]}
          />
          <ShowcaseBlock
              title="Выбирайте из множества вкусов"
              itemsUrl={"/api/items/"}
              buttonText="Больше вкусов"
              buttonLink="/shop"
          />
      </Box>
  )
}