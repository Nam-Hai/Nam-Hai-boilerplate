function lineSpaning(spans: HTMLElement[]) {
  const node1 = N.Cr("span");
  N.Class.add(node1, "splited-line");
  let spanText = "";
  for (const span of spans) {
    spanText += span.innerText + " ";
  }
  node1.innerText = spanText;
  return node1;
}

export const useSplitLine = {
  ref: (wrapper: Ref<HTMLElement>) => {
    let text = "";
    onMounted(() => {
      computeLines();
    });
    const { breakpoint } = useStoreView();
    watch(breakpoint, () => {
      wrapper.value.innerHTML = text;
      computeLines();
    });

    function computeLines() {
      if (!wrapper.value) return;
      text = wrapper.value.innerText;
      const spans = split(wrapper.value);
      const arrayLines = calculate(spans);
      const nodeLines = arrayLines.map((line) => lineSpaning(line));

      wrapper.value.innerHTML = "";
      for (const line of nodeLines) {
        wrapper.value.appendChild(line);
      }
    }
  },

  refs: (wrappers: Ref<HTMLElement[]>) => {
    onMounted(() => {
      for (const wrapper of wrappers.value) {
        const spans = split(wrapper);
        const arrayLines = calculate(spans);
        const nodeLines = arrayLines.map((line) => lineSpaning(line));

        wrapper.innerHTML = "";
        for (const line of nodeLines) {
          wrapper.appendChild(line);
        }
      }
    });
  },
};

export const useSplitAnime = (elRef: Ref<HTMLElement>, show: Ref<boolean>) => {
  useSplitLine.ref(elRef);

  const textHeight = ref(0);
  onMounted(() => {
    textHeight.value = elRef.value.getBoundingClientRect().height;
  });

  const tlShow = ref(useTL());

  watch(show, (show) => {
    animation(show)
  });

  const { breakpoint } = useStoreView()
  watch(breakpoint, async () => {
    await nextTick()
    animation(show.value)
  })

  function animation(show: boolean) {
    tlShow.value.pause();
    tlShow.value = useTL();
    if (show) {
      const splitedLine = N.getAll(
        ".splited-line",
        elRef.value
      ) as NodeListOf<HTMLElement>;
      // const delayLine = breakpoint.value == 'desktop' ? 100 : 50
      const delayLine = 20;
      for (let index = 0; index < splitedLine.length; index++) {
        const line = splitedLine[index];
        N.O(line, 1)
        N.T(line, 0, textHeight.value, "px");
        tlShow.value.from({
          el: line,
          p: {
            o: [1, 1],
            y: [textHeight.value, 0, "px"],
          },
          d: 700,
          e: "o4",
          delay: index * delayLine,
        });
      }

      N.O(elRef.value, 1)
      tlShow.value.play();
    }

  }
};
