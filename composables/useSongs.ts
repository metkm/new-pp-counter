interface Background {
  id: ReturnType<typeof crypto.randomUUID>;
  name?: string;
  src: string;
}

export const getImageFromHtml = async (innerHtml: string, name?: string) => {
  const images = regexMatchGroupToArray(innerHtml).filter(
    (val) =>
      val.endsWith(".jpg") || val.endsWith(".png") || val.endsWith(".jpeg")
  );

  const image = images.at(0);
  if (!image) return;

  const id = crypto.randomUUID();
  const src = `http://127.0.0.1:24050/Songs/${name}${image}`
  const optimized = await optimizeImage(src)

  return {
    id,
    name: name,
    src: optimized,
  };
}

export const useSongs = async (folders: string[]) => {
  const backgrounds = ref<Background[]>([]);

  const chunkSize = 50;
  for (let index = 0; index < folders.length; index += chunkSize) {
    const chunk = folders.slice(index, index + chunkSize)

    const results = await Promise.allSettled(chunk.map(ch =>
      fetch(`http://localhost:24050/Songs/${encodeURI(ch)}`).then(
        (response) => response.text()
      )
    ))

    const bgs = (await Promise.allSettled(
      results.map(async (innerHtml, i) => {
        if (innerHtml.status === 'rejected') return;

        return await getImageFromHtml(innerHtml.value, folders[i + index])
      })
    ))
    .map(val => {
      if (val.status === 'fulfilled') {
        return val.value
      }
    })
    .filter(val => !!val)

    backgrounds.value.push(...bgs)
  }

  const addNewSong = async (folderName: string) => {
    const response = await fetch(`http://localhost:24050/Songs/${encodeURI(folderName)}`)
    const innerHtml = await response.text()

    const result = await getImageFromHtml(innerHtml, folderName)
    if (!result) return

    backgrounds.value.splice(
      Math.random() * (backgrounds.value.length),
      0,
      result
    )
  }

  return {
    backgrounds,
    addNewSong
  };
};
