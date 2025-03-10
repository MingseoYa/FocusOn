"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { DatePicker } from "antd";

import { Heart } from "lucide-react";
import styles from "./styles.module.css";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Code,
  Palette,
  Megaphone,
  Camera,
  Music,
  Globe,
  UserCheck,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { FETCH_PRODUCTS } from "./queries";
import { focusOnServices, top3Services } from "./mock";

const categories = [
  { name: "개발", icon: <Code /> },
  { name: "디자인", icon: <Palette /> },
  { name: "마케팅", icon: <Megaphone /> },
  { name: "사진영상", icon: <Camera /> },
  { name: "음악", icon: <Music /> },
  { name: "번역", icon: <Globe /> },
  { name: "컨설팅", icon: <UserCheck /> },
  { name: "글쓰기", icon: <Edit /> },
];

dayjs.extend(customParseFormat);
const dateFormat = "YYYY.MM.DD";
const { RangePicker } = DatePicker;

export default function ProductsList() {
  const [filter, setFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { data } = useQuery(FETCH_PRODUCTS);
  console.log("products: ", data);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Here you would typically call an API to update the wishlist status
    console.log(
      `Product ${productId} ${
        isWishlisted ? "removed from" : "added to"
      } wishlist`
    );
  };

  const onClickCategory = (category) => {
    setActiveCategory(category.name);
  };

  const filteredServices = focusOnServices.filter(
    (service) =>
      filter === "all" ||
      (filter === "available" && service.available) ||
      (filter === "unavailable" && !service.available)
  );

  return (
    <div className={styles.container}>
      <section className={styles.top3_section}>
        <h2>포커스온 인기 TOP3 서비스</h2>
        <div className={styles.top3_list}>
          {top3Services.map((service) => (
            <div key={service.id} className={styles.top3_item}>
              <div className={styles.top3_image_container}>
                <Image
                  className={styles.service_image}
                  src={service.image}
                  alt={service.name}
                  fill
                />
                <button
                  onClick={toggleWishlist}
                  className={`
        ${styles.button} 
        ${styles.buttonOutline} 
        ${isWishlisted ? styles.buttonOutlineRed : ""}
        ${isWishlisted ? styles.buttonOutlineRedDark : ""}
      `}
                >
                  <Heart
                    className={`
          ${styles.icon} 
          ${isWishlisted ? styles.iconFilled : styles.iconDefault}
        `}
                  />
                  <span className="sr-only">찜하기</span>
                </button>
              </div>
              <div className={styles.top3_content}>
                <h3>{service.name}</h3>
                <div className={styles.tags}>
                  {service.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className={styles.price}>{service.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.focus_on_services}>
        <h2>포커스온만의 서비스</h2>
        <div className={styles.filter_menu}>
          <button
            className={`${styles.filter_button} ${
              filter === "all" ? styles.active : ""
            }`}
            onClick={() => setFilter("all")}
          >
            전체 보기
          </button>
          <button
            className={`${styles.filter_button} ${
              filter === "available" ? styles.active : ""
            }`}
            onClick={() => setFilter("available")}
          >
            예약 가능
          </button>
          <button
            className={`${styles.filter_button} ${
              filter === "unavailable" ? styles.active : ""
            }`}
            onClick={() => setFilter("unavailable")}
          >
            예약 마감
          </button>
        </div>
        {/* 검색 창 */}
        <div className={styles.search_area}>
          <div className={styles.search_bar_box}>
            <Image
              src="/images/search.png"
              width={24}
              height={24}
              alt="돋보기"
              className={styles.search_icon}
            />
            <input
              type="text"
              className={styles.search_bar}
              placeholder="제목을 검색해 주세요."
              // onChange={onChangeSearch}
            />
          </div>
          <button className={styles.search_button}>검색</button>
          <Link href="/products/new" className={styles.service_button}>
            <Edit size={18} />
            서비스 등록
          </Link>
        </div>

        <div className={styles.category_container}>
          {categories.map((category) => (
            <button
              key={category.name}
              className={`${styles.category_button} ${
                activeCategory === category.name ? styles.active : ""
              }`}
              onClick={() => onClickCategory(category)}
            >
              <span className={styles.icon}>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
        <div className={styles.service_grid}>
          {filteredServices.map((service) => (
            <div key={service.id} className={styles.service_card}>
              <div className={styles.service_image_container}>
                <Image
                  src={service.image}
                  alt={service.name}
                  layout="fill"
                  objectFit="cover"
                />
                <div className={styles.like_button}>
                  <Heart size={20} />
                  <span>{service.likes}</span>
                </div>
              </div>
              <div className={styles.service_content}>
                <h3>{service.name}</h3>
                <div className={styles.tags}>
                  {service.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className={styles.price}>{service.price}</p>
                <div className={styles.service_footer}>
                  <div className={styles.author}>
                    <Image
                      src={service.author.image}
                      alt={service.author.name}
                      width={24}
                      height={24}
                    />
                    <span>{service.author.name}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
