import React, { useState, useEffect } from "react"
import { RadioButton } from "@jk/jui"
import { useQuery } from "@blitzjs/rpc"
import getReviews from "app/reviews/queries/getReviews"
import Slider from "react-slick"
import { sliderConfig } from "app/configs/sliderConfig"
import Image from "next/image"
import { routers } from "app/configs/routerConfig"
import { useRouter } from "next/router"

const Board = () => {
  const router = useRouter()

  const routersConfig = [
    ...routers[0]?.children,
    {
      label: "會員中心",
      key: "member",
      path: "/UserInfo",
    },
  ]

  const handleOnClick = (path) => {
    void router.push(path)
  }

  const settings = {
    speed: 500,
    centerMode: true,
    infinite: true,
    centerPadding: "0px",
    slidesToShow: 3,
    slidesToScroll: 1,
    lazyLoad: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <div className="my-10 h-screen flex flex-col justify-start">
      <Slider {...settings}>
        {sliderConfig.map((items, i) => (
          <div key={i} className="min-h-[300px] relative">
            <Image
              alt={items?.title}
              src={items?.src}
              layout="fill"
              objectFit="cover"
              priority={true}
            />
            <div className="absolute bottom-4 left-4">
              <h2 className="font-bold text-xl">{items?.title}</h2>
              <p>{items?.subTitle}</p>
            </div>
          </div>
        ))}
      </Slider>
      <div className="flex justify-center items-center flex-col my-4 p-4 text-center">
        <p className="text-3xl text-slate-600">特約合作夥伴</p>
        <p className="my-4 text-slate-600">
          共同加入並在充滿活力的商業生態系統中成長。透過我們的合作夥伴
        </p>
      </div>
      <ul className="flex flex-col justify-center items-center lg:flex-row">
        {routersConfig.map((el) => (
          <div
            className="w-1/2 lg:w-1/4 h-16 lg:h-48 lg:mx-4 rounded-xl bg-slate-200 my-4 flex items-center justify-center cursor-pointer"
            key={el.key}
            onClick={() => handleOnClick(el?.path)}
          >
            {/* <Image
              alt={el?.label}
              src={el?.src}
              layout="fill"
              objectFit="contain"
              height="100"
              width="100"
              priority={true}
            /> */}
            <p>{el.label}</p>
          </div>
        ))}
      </ul>
    </div>
  )
}

export default Board
