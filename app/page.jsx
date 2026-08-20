"use client";

import { useEffect } from "react";
import Image from "next/image";
import logo from "./logo copy.png";
import item_one from "./1.png";
import item_two from "./2.png";
import item_three from "./3.png";
import item_four from "./4.png";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export default function Home() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.fonts.ready.then(() => {
        const itemTargets = [
          { x: "-20vw", y: "-30vh", rotation: -20 },
          { x: "25vw", y: "-20vh", rotation: 15 },
          { x: "-32vw", y: "0vh", rotation: 12 },
          { x: "15vw", y: "30vh", rotation: -15 },
        ];

        const EXIT_DISTANCE = 3.5;
        const itemExits = itemTargets.map((target) => ({
          x: parseFloat(target.x) * EXIT_DISTANCE + "vw",
          y: parseFloat(target.y) * EXIT_DISTANCE + "vh",
          rotation: target.rotation * 2.5,
        }));

        const items = gsap.utils.toArray(".item");
        const floatingTweens = [];

        const tl = gsap.timeline({ delay: 0.5 });

        tl.fromTo(
          ".preloader-revealer",
          { clipPath: "circle(0% at 50% 50%)" },
          {
            clipPath: "circle(150% at 50% 50%)",
            duration: 1,
            stagger: 0.25,
            ease: "power2.inOut",
          },
        );

        tl.set(".preloader-revealer", { display: "none" });

        items.forEach((item, i) => {
          const target = itemTargets[i];
          const image = item.querySelector("img");

          tl.to(
            item,
            {
              x: target.x,
              y: target.y,
              scale: 1,
              rotation: target.rotation,
              duration: 1,
              ease: "power3.out",
              onStart: () => {
                floatingTweens[i] = gsap.to(image, {
                  y: gsap.utils.random(-15, -25),
                  duration: gsap.utils.random(1.5, 2.5),
                  ease: "sine.inOut",
                  yoyo: true,
                  repeat: -1,
                  delay: gsap.utils.random(0, 0.5),
                });
              },
            },
            i === 0 ? "-=0.55" : "<0.075",
          );
        });

        tl.to(
          ".preloader-logo",
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          "<",
        );

        tl.to({}, { duration: 1 });

        tl.add(() => floatingTweens.forEach((tween) => tween.kill()));

        items.forEach((item, i) => {
          const exit = itemExits[i];
          tl.to(
            item,
            {
              x: exit.x,
              y: exit.y,
              scale: 2.5,
              rotation: exit.rotation,
              duration: 0.75,
              ease: "power2.in",
            },
            i === 0 ? ">" : "<0.075",
          );
        });

        tl.to(".preloader-logo", {
          y: "-120vh",
          scale: 2.5,
          ease: "power2.in",
          duration: 0.75,
        });

        tl.to(".preloader", {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });

        tl.set(".preloader", { display: "none" });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="preloader">
        <div className="preloader-bg"></div>
        <div className="preloader-revealer preloader-revealer-1"></div>
        <div className="preloader-revealer preloader-revealer-2"></div>
        <div className="preloader-revealer preloader-revealer-3"></div>
        <div className="preloader-revealer preloader-revealer-4"></div>

        <div className="items">
          <div className="item item-1">
            <Image src={item_one} alt="" />
          </div>
          <div className="item item-2">
            <Image src={item_two} alt="" />
          </div>
          <div className="item item-3">
            <Image src={item_three} alt="" />
          </div>
          <div className="item item-4">
            <Image src={item_four} alt="" />
          </div>
        </div>

        <div className="preloader-logo">
          <Image src={logo} alt="" />
        </div>
      </div>
    </>
  );
}
