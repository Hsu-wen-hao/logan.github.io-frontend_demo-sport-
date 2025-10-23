(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const navToggle = document.querySelector(".nav-toggle");
    const mainNav = document.querySelector(".main-nav");
    const navLinks = mainNav ? mainNav.querySelectorAll("a") : [];
    const toTopButton = document.querySelector(".to-top");
    const globalStatus = document.getElementById("global-status");

    function closeNav() {
      if (mainNav) {
        mainNav.classList.remove("is-open");
      }
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }
      body.classList.remove("nav-open");
    }

    if (navToggle && mainNav) {
      navToggle.addEventListener("click", function () {
        const isOpen = mainNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        body.classList.toggle("nav-open", isOpen);
      });

      navLinks.forEach(function (link) {
        link.addEventListener("click", closeNav);
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 1024) {
          closeNav();
        }
      });
    }

    const programFilters = document.querySelectorAll(".program-filter");
    const programCards = document.querySelectorAll(".program-card");

    if (programFilters.length) {
      programFilters.forEach(function (button) {
        button.addEventListener("click", function () {
          const filter = button.getAttribute("data-filter");
          programFilters.forEach(function (btn) {
            btn.classList.toggle("is-active", btn === button);
            btn.setAttribute("aria-selected", String(btn === button));
          });

          programCards.forEach(function (card) {
            const category = card.getAttribute("data-category");
            const shouldShow = filter === "all" || category === filter;
            card.classList.toggle("is-hidden", !shouldShow);
            card.toggleAttribute("hidden", !shouldShow);
          });
        });
      });
    }

    const scheduleTabs = document.querySelectorAll(".schedule-tab");
    const schedulePanels = document.querySelectorAll(".schedule-panel");

    schedulePanels.forEach(function (panel) {
      const isActive = panel.classList.contains("is-active");
      panel.toggleAttribute("hidden", !isActive);
    });

    if (scheduleTabs.length) {
      scheduleTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          const target = tab.getAttribute("data-target");
          scheduleTabs.forEach(function (btn) {
            const active = btn === tab;
            btn.classList.toggle("is-active", active);
            btn.setAttribute("aria-selected", String(active));
          });

          schedulePanels.forEach(function (panel) {
            const isActive = panel.id === target;
            panel.classList.toggle("is-active", isActive);
            panel.toggleAttribute("hidden", !isActive);
          });
        });
      });
    }

    const counterElements = document.querySelectorAll("[data-count]");

    function animateCount(el) {
      const target = parseFloat(el.dataset.count || "0");
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const duration = 1600;
      let start = null;

      function formatValue(value) {
        return prefix + value.toFixed(decimals) + suffix;
      }

      function step(timestamp) {
        if (!start) {
          start = timestamp;
        }
        const progress = Math.min((timestamp - start) / duration, 1);
        const current = target * progress;
        const displayValue = decimals > 0 ? current : Math.round(current);
        el.textContent = formatValue(displayValue);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = formatValue(target);
        }
      }

      window.requestAnimationFrame(step);
    }

    if (counterElements.length) {
      const counterObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          threshold: 0.4,
        }
      );

      counterElements.forEach(function (el) {
        counterObserver.observe(el);
      });
    }

    function handleScroll() {
      if (!toTopButton) return;
      if (window.scrollY > 320) {
        toTopButton.classList.add("is-visible");
      } else {
        toTopButton.classList.remove("is-visible");
      }
    }

    if (toTopButton) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      toTopButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    const sliderTrack = document.querySelector(".slider-track");
    const testimonialCards = sliderTrack ? Array.from(sliderTrack.querySelectorAll(".testimonial-card")) : [];
    const prevButton = document.querySelector(".slider-control.prev");
    const nextButton = document.querySelector(".slider-control.next");
    const dotsContainer = document.querySelector(".slider-dots");
    let currentSlide = 0;
    let sliderTimer;

    function updateSlider(index) {
      if (!testimonialCards.length) return;
      if (index < 0) {
        currentSlide = testimonialCards.length - 1;
      } else if (index >= testimonialCards.length) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }

      testimonialCards.forEach(function (card, cardIndex) {
        const isActive = cardIndex === currentSlide;
        card.classList.toggle("is-active", isActive);
        card.toggleAttribute("hidden", !isActive);
      });

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll(".slider-dot");
        dots.forEach(function (dot, dotIndex) {
          const isActive = dotIndex === currentSlide;
          dot.classList.toggle("is-active", isActive);
          dot.setAttribute("aria-selected", String(isActive));
        });
      }
    }

    function startSlider() {
      stopSlider();
      sliderTimer = window.setInterval(function () {
        updateSlider(currentSlide + 1);
      }, 7000);
    }

    function stopSlider() {
      if (sliderTimer) {
        window.clearInterval(sliderTimer);
        sliderTimer = null;
      }
    }

    if (testimonialCards.length) {
      if (dotsContainer) {
        dotsContainer.innerHTML = "";
        testimonialCards.forEach(function (_card, index) {
          const dot = document.createElement("button");
          dot.className = "slider-dot" + (index === 0 ? " is-active" : "");
          dot.type = "button";
          dot.setAttribute("role", "tab");
          dot.setAttribute("aria-label", "切換到第 " + (index + 1) + " 則回饋");
          dot.setAttribute("aria-selected", String(index === 0));
          dot.addEventListener("click", function () {
            updateSlider(index);
            startSlider();
          });
          dotsContainer.appendChild(dot);
        });
      }

      updateSlider(0);
      startSlider();

      const sliderArea = document.querySelector(".testimonial-slider");
      if (sliderArea) {
        sliderArea.addEventListener("mouseenter", stopSlider);
        sliderArea.addEventListener("mouseleave", startSlider);
        sliderArea.addEventListener("focusin", stopSlider);
        sliderArea.addEventListener("focusout", startSlider);
      }

      if (prevButton) {
        prevButton.addEventListener("click", function () {
          updateSlider(currentSlide - 1);
          startSlider();
        });
      }

      if (nextButton) {
        nextButton.addEventListener("click", function () {
          updateSlider(currentSlide + 1);
          startSlider();
        });
      }
    }

    function setFeedback(formElement, message, isError) {
      const feedback = formElement.querySelector(".form-feedback");
      if (feedback) {
        feedback.textContent = message;
        feedback.style.color = isError ? "#c62828" : "#0f713e";
      }
      if (globalStatus && message) {
        globalStatus.textContent = message;
      }
    }

    const bookingForm = document.getElementById("booking-planner");
    if (bookingForm) {
      const locationSelect = document.getElementById("booking-location");
      const courtSelect = document.getElementById("booking-court");
      const sessionSelect = document.getElementById("booking-session");
      const levelSelect = document.getElementById("booking-level");
      const dateInput = document.getElementById("booking-date");
      const timeSelect = document.getElementById("booking-time");
      const slotGrid = document.getElementById("slot-grid");
      const slotSummary = document.getElementById("slot-summary");
      const slotEmpty = document.getElementById("slot-empty");
      const slotFilters = document.querySelectorAll(".slot-filter");

      const locationLabels = {
        taipei: "台北信義館",
        taichung: "台中洲際館",
        kaohsiung: "高雄濱海館"
      };

      const courtLabels = {
        "indoor-hard": "室內硬地場",
        "indoor-clay": "室內紅土場",
        "outdoor-hard": "戶外硬地場"
      };

      const levelLabels = {
        beginner: "初學",
        intermediate: "中階",
        advance: "進階 / 競技"
      };

      const bookingInventory = {
        "indoor-hard": {
          private: {
            weekday: [
              { start: "07:30", end: "09:00", coaches: ["王立凱"], focus: "步伐節奏與底線穩定度", levels: ["beginner", "intermediate"], spots: 1, notes: "含場地照明與球機輔助" },
              { start: "10:30", end: "12:00", coaches: ["陳怡拉"], focus: "發球節奏與拍面控制", levels: ["beginner", "intermediate"], spots: 1, notes: "提供慢動作錄影分析" },
              { start: "19:00", end: "20:30", coaches: ["Lucas"], focus: "賽前臨場戰術模擬", levels: ["intermediate", "advance"], spots: 1, notes: "比賽策略諮詢 15 分鐘" }
            ],
            weekend: [
              { start: "09:00", end: "10:30", coaches: ["陳怡拉"], focus: "核心穩定與移位腳步", levels: ["beginner", "intermediate"], spots: 1, notes: "贈送暖身帶進場" },
              { start: "14:30", end: "16:00", coaches: ["王立凱"], focus: "對抗練習與臨場決策", levels: ["intermediate", "advance"], spots: 1, notes: "含實戰數據紀錄" },
              { start: "18:00", end: "19:30", coaches: ["Mia"], focus: "賽後恢復與技巧微調", levels: ["intermediate", "advance"], spots: 1, notes: "附加伸展與恢復建議" }
            ]
          },
          double: {
            weekday: [
              { start: "08:00", end: "09:30", coaches: ["Lucas", "Mia"], focus: "網前默契與雙打站位", levels: ["intermediate", "advance"], spots: 2, notes: "提供戰術板分析" },
              { start: "18:30", end: "20:00", coaches: ["王立凱"], focus: "攻守轉換與反拍反應", levels: ["intermediate", "advance"], spots: 2, notes: "含場邊即時講解" }
            ],
            weekend: [
              { start: "11:00", end: "12:30", coaches: ["Lucas"], focus: "配對戰術演練", levels: ["intermediate", "advance"], spots: 2, notes: "贈送戰術筆記" },
              { start: "16:30", end: "18:00", coaches: ["Ella"], focus: "接發球壓迫與快攻", levels: ["advance"], spots: 2, notes: "提供發球機練習" }
            ]
          },
          junior: {
            weekday: [
              { start: "16:30", end: "18:00", coaches: ["Ella", "Mia"], focus: "步伐節奏與協調性", levels: ["beginner", "intermediate"], spots: 4, notes: "含體能暖身 15 分鐘" }
            ],
            weekend: [
              { start: "10:00", end: "11:30", coaches: ["Ella"], focus: "球感培養與比賽禮儀", levels: ["beginner", "intermediate"], spots: 6, notes: "每月進度回饋" },
              { start: "15:00", end: "16:30", coaches: ["Mia"], focus: "敏捷與反應訓練", levels: ["intermediate"], spots: 6, notes: "含體能測驗" }
            ]
          }
        },
        "indoor-clay": {
          private: {
            weekday: [
              { start: "09:00", end: "10:30", coaches: ["Lucas"], focus: "紅土步伐與上旋控制", levels: ["intermediate", "advance"], spots: 1, notes: "提供紅土專用球鞋租借" },
              { start: "17:30", end: "19:00", coaches: ["陳怡拉"], focus: "防守轉攻策略", levels: ["intermediate", "advance"], spots: 1, notes: "含戰術筆記" }
            ],
            weekend: [
              { start: "08:30", end: "10:00", coaches: ["Lucas"], focus: "紅土專項移動與吊小球", levels: ["intermediate", "advance"], spots: 1, notes: "提供球鞋清潔服務" }
            ]
          },
          double: {
            weekday: [
              { start: "19:00", end: "20:30", coaches: ["Lucas", "王立凱"], focus: "紅土雙打節奏", levels: ["advance"], spots: 2, notes: "附贈戰術分析報告" }
            ],
            weekend: [
              { start: "13:00", end: "14:30", coaches: ["Ella"], focus: "防守反攻與落點控制", levels: ["intermediate", "advance"], spots: 2, notes: "含場邊回放" }
            ]
          },
          junior: {
            weekday: [
              { start: "15:30", end: "17:00", coaches: ["Mia"], focus: "紅土移動與滑步基礎", levels: ["intermediate"], spots: 5, notes: "提供球鞋租借" }
            ],
            weekend: [
              { start: "09:30", end: "11:00", coaches: ["Ella"], focus: "比賽節奏與得分策略", levels: ["intermediate"], spots: 6, notes: "含比賽情境模擬" }
            ]
          }
        },
        "outdoor-hard": {
          private: {
            weekday: [
              { start: "06:30", end: "08:00", coaches: ["王立凱"], focus: "晨間體能與底線強化", levels: ["advance"], spots: 1, notes: "含心率監測" },
              { start: "12:30", end: "14:00", coaches: ["Mia"], focus: "陽光下發球節奏", levels: ["beginner", "intermediate"], spots: 1, notes: "提供補水電解飲" }
            ],
            weekend: [
              { start: "17:00", end: "18:30", coaches: ["Lucas"], focus: "黃昏賽事模擬", levels: ["intermediate", "advance"], spots: 1, notes: "附球速追蹤" }
            ]
          },
          double: {
            weekday: [
              { start: "20:00", end: "21:30", coaches: ["Ella"], focus: "夜間燈光下的雙打默契", levels: ["intermediate", "advance"], spots: 2, notes: "提供夜間照明免費" }
            ],
            weekend: [
              { start: "08:00", end: "09:30", coaches: ["Lucas"], focus: "快節奏發接發", levels: ["intermediate", "advance"], spots: 2, notes: "贈送策略手冊" }
            ]
          },
          junior: {
            weekday: [
              { start: "17:30", end: "19:00", coaches: ["Mia"], focus: "戶外移位與腳步訓練", levels: ["beginner", "intermediate"], spots: 6, notes: "含燈光與練習球" }
            ],
            weekend: [
              { start: "15:30", end: "17:00", coaches: ["Ella"], focus: "分組對抗與團隊合作", levels: ["beginner", "intermediate"], spots: 8, notes: "贈送訓練紀錄表" }
            ]
          }
        }
      };

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const fakeDateSeeds = {
        weekday: new Date(2024, 6, 18),
        weekend: new Date(2024, 6, 20)
      };

      Object.keys(fakeDateSeeds).forEach(function (key) {
        fakeDateSeeds[key].setHours(0, 0, 0, 0);
      });

      function formatInputDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      function formatDisplayDate(date) {
        const days = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} (${days[date.getDay()]})`;
      }

      function getFakeDateLabel(date) {
        if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
          return formatDisplayDate(fakeDateSeeds.weekday);
        }
        const seed = isWeekend(date) ? fakeDateSeeds.weekend : fakeDateSeeds.weekday;
        return formatDisplayDate(seed);
      }

      function matchesTimePreference(pref, time) {
        if (pref === "any") return true;
        const hour = parseInt(time.split(":")[0], 10);
        if (pref === "morning") return hour < 12;
        if (pref === "afternoon") return hour >= 12 && hour < 17;
        if (pref === "evening") return hour >= 17;
        return true;
      }

      function isWeekend(date) {
        const day = date.getDay();
        return day === 0 || day === 6;
      }

      function getUpcomingWeekend() {
        const result = new Date();
        result.setHours(0, 0, 0, 0);
        const day = result.getDay();
        if (day === 6 || day === 0) {
          return result;
        }
        const offset = 6 - day;
        result.setDate(result.getDate() + offset);
        return result;
      }

      function activateFilterForDate(date) {
        if (!slotFilters.length) return;
        const current = new Date();
        current.setHours(0, 0, 0, 0);
        const target = new Date(date.getTime());
        target.setHours(0, 0, 0, 0);
        const diff = Math.round((target.getTime() - current.getTime()) / 86400000);
        slotFilters.forEach(function (btn) {
          btn.classList.remove("is-active");
          const offset = parseInt(btn.dataset.offset || "", 10);
          if (Number.isNaN(offset)) return;
          if (offset === 3 && isWeekend(target)) {
            btn.classList.add("is-active");
          } else if (offset === diff) {
            btn.classList.add("is-active");
          }
        });
      }

      if (dateInput) {
        const minDate = formatInputDate(today);
        dateInput.min = minDate;
        if (!dateInput.value) {
          dateInput.value = minDate;
        }
      }

      let lastPayload = null;

      function computeSlots(payload) {
        if (!(payload.date instanceof Date) || Number.isNaN(payload.date.getTime())) {
          return [];
        }
        const schedule = bookingInventory[payload.court];
        if (!schedule) {
          return [];
        }
        const sessionSet = schedule[payload.session];
        if (!sessionSet) {
          return [];
        }
        const dayType = isWeekend(payload.date) ? "weekend" : "weekday";
        const baseSlots = sessionSet[dayType] || [];
        return baseSlots
          .filter(function (slot) {
            return slot.levels.includes(payload.level);
          })
          .filter(function (slot) {
            return matchesTimePreference(payload.timePreference, slot.start);
          });
      }

      function renderSlots(payload) {
        if (!slotGrid) return;
        const isSample = Boolean(payload && payload.isSample);
        const slots = computeSlots(payload);
        const hasSlots = slots.length > 0;
        slotGrid.classList.toggle("is-sample", isSample && hasSlots);
        slotGrid.innerHTML = "";
        if (slotSummary) {
          slotSummary.textContent = "";
          slotSummary.classList.remove("is-sample");
        }
        if (!hasSlots) {
          if (slotEmpty) {
            const locationText = locationLabels[payload.location] || "所選場館";
            const courtText = courtLabels[payload.court] || "指定球場";
            slotEmpty.textContent = `目前 ${locationText}・${courtText} 尚無符合條件的空檔，歡迎填寫下方表單由專人協助。`;
            slotEmpty.hidden = false;
          }
          return;
        }
        if (slotEmpty) {
          slotEmpty.hidden = true;
        }
        const fakeDateLabel = getFakeDateLabel(payload.date);
        if (slotSummary) {
          const locationText = locationLabels[payload.location] || "";
          const courtText = courtLabels[payload.court] || "";
          const summaryPrefix = isSample ? "示意：" : "";
          slotSummary.textContent = `${summaryPrefix}${locationText}・${courtText}｜${fakeDateLabel} 找到 ${slots.length} 個推薦時段`;
          slotSummary.classList.toggle("is-sample", isSample);
        }
        const fragment = document.createDocumentFragment();
        slots.forEach(function (slot) {
          const card = document.createElement("article");
          card.className = "slot-card";
          card.setAttribute("role", "listitem");
          const coachLabel = slot.coaches.join("、");
          const levelText = slot.levels.map(function (level) {
            return levelLabels[level] || level;
          }).join(" / ");
          const locationText = locationLabels[payload.location] || "樂活網球 場館";
          const courtText = courtLabels[payload.court] || "專屬球場";
          const noteText = slot.notes ? `<span>貼心服務：${slot.notes}</span>` : "";
          card.innerHTML = `
            <div class="slot-card__header">
              <span>${fakeDateLabel} ${slot.start} - ${slot.end}</span>
              <span class="badge">剩餘 ${slot.spots} 席</span>
            </div>
            <div class="slot-card__meta">
              <span>教練：${coachLabel}</span>
              <span>課程重點：${slot.focus}</span>
              <span>適合等級：${levelText}</span>
              <span>場地：${locationText}｜${courtText}</span>
              ${noteText}
            </div>
            <button class="btn btn-outline" type="button">預約這個時段</button>
          `;
          if (isSample) {
            card.classList.add("is-sample");
          }
          fragment.appendChild(card);
        });
        slotGrid.appendChild(fragment);
        slotGrid.querySelectorAll("button").forEach(function (button) {
          button.addEventListener("click", function () {
            const card = button.closest(".slot-card");
            if (!card) return;
            slotGrid.querySelectorAll(".slot-card").forEach(function (item) {
              item.classList.remove("is-selected");
            });
            card.classList.add("is-selected");
            if (globalStatus) {
              const label = card.querySelector(".slot-card__header span");
              const timeRange = label ? label.textContent : "所選時段";
              globalStatus.textContent = `已暫時保留 ${locationLabels[payload.location] || "指定場館"} ${courtLabels[payload.court] || "球場"} ${timeRange}，請於 15 分鐘內完成預約。`;
            }
          });
        });
      }

      slotFilters.forEach(function (btn) {
        btn.addEventListener("click", function () {
          slotFilters.forEach(function (item) {
            item.classList.remove("is-active");
          });
          btn.classList.add("is-active");
          const offset = parseInt(btn.dataset.offset || "", 10);
          if (!dateInput || Number.isNaN(offset)) {
            return;
          }
          let target;
          if (offset === 3) {
            target = getUpcomingWeekend();
          } else {
            target = new Date(today.getTime());
            target.setDate(target.getDate() + offset);
          }
          dateInput.value = formatInputDate(target);
          if (lastPayload) {
            lastPayload = {
              location: lastPayload.location,
              court: lastPayload.court,
              session: lastPayload.session,
              level: lastPayload.level,
              timePreference: lastPayload.timePreference,
              date: target
            };
            renderSlots(lastPayload);
          }
        });
      });

      function renderSampleSlots() {
        if (!slotGrid) return;
        const samplePayload = {
          location: "taipei",
          court: "indoor-hard",
          session: "private",
          level: "intermediate",
          timePreference: "any",
          date: new Date(fakeDateSeeds.weekday.getTime()),
          isSample: true
        };
        renderSlots(samplePayload);
      }

      renderSampleSlots();

      bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!bookingForm.reportValidity()) {
          return;
        }
        if (!dateInput || !dateInput.value) {
          setFeedback(bookingForm, "請先選擇日期。", true);
          return;
        }
        const payload = {
          location: locationSelect ? locationSelect.value : "",
          court: courtSelect ? courtSelect.value : "",
          session: sessionSelect ? sessionSelect.value : "",
          level: levelSelect ? levelSelect.value : "",
          timePreference: timeSelect ? timeSelect.value || "any" : "any",
          date: new Date(dateInput.value)
        };
        lastPayload = payload;
        activateFilterForDate(payload.date);
        renderSlots(payload);
      });
    }

    const bookingRequestForm = document.querySelector(".booking-request-form");
    if (bookingRequestForm) {
      bookingRequestForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const requiredFields = Array.from(bookingRequestForm.querySelectorAll("[required]"));
        const firstInvalid = requiredFields.find(function (field) {
          return !field.value.trim();
        });
        if (firstInvalid) {
          setFeedback(bookingRequestForm, "請先完成必填欄位。", true);
          firstInvalid.focus();
          return;
        }
        setFeedback(bookingRequestForm, "正在安排專人聯絡...", false);
        window.setTimeout(function () {
          setFeedback(bookingRequestForm, "已收到需求，我們會於 12 小時內與你聯繫。", false);
          bookingRequestForm.reset();
        }, 900);
      });
    }
    const newsletterForm = document.querySelector(".newsletter-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const emailInput = newsletterForm.querySelector("input[type='email']");
        if (emailInput && !emailInput.value.trim()) {
          setFeedback(newsletterForm, "請輸入電子郵件。", true);
          emailInput.focus();
          return;
        }
        setFeedback(newsletterForm, "正在送出...", false);
        window.setTimeout(function () {
          setFeedback(newsletterForm, "訂閱成功！請留意最新資訊。", false);
          newsletterForm.reset();
        }, 600);
      });
    }

    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const requiredFields = Array.from(contactForm.querySelectorAll("[required]"));
        const firstInvalid = requiredFields.find(function (field) {
          return !field.value.trim();
        });
        if (firstInvalid) {
          setFeedback(contactForm, "請完整填寫必填欄位。", true);
          firstInvalid.focus();
          return;
        }
        setFeedback(contactForm, "正在傳送預約資訊...", false);
        window.setTimeout(function () {
          setFeedback(contactForm, "已收到你的預約需求，我們會盡快與你聯繫！", false);
          contactForm.reset();
        }, 800);
      });
    }

    const joinForm = document.querySelector(".join-form");
    if (joinForm) {
      joinForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const requiredFields = Array.from(joinForm.querySelectorAll("[required]"));
        const firstInvalid = requiredFields.find(function (field) {
          return !field.value.trim();
        });
        if (firstInvalid) {
          setFeedback(joinForm, "請完整填寫必填欄位。", true);
          firstInvalid.focus();
          return;
        }
        setFeedback(joinForm, "履歷已送出，請稍候...", false);
        window.setTimeout(function () {
          setFeedback(joinForm, "感謝投遞！我們將於 7 個工作日內與你聯繫。", false);
          joinForm.reset();
        }, 900);
      });
    }
  });
})();


