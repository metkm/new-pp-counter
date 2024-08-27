import { regexMatchGroupToArray } from "~/utils/regexMatchToArray";


export const useGosumemory = async () => {
  const { data: dataSocketUnparsed } = useWebSocket<string>(
    "ws://localhost:24050/ws"
  );

  const data = computed(() =>
    dataSocketUnparsed.value ? JSON.parse(dataSocketUnparsed.value) : undefined
  );

  const { data: songFoldersHtml } = await useFetch<string>('http://localhost:24050/Songs/')
  const songFolderNames = songFoldersHtml.value ? regexMatchGroupToArray(songFoldersHtml.value) : []

  return {
    data,
    songFolderNames,
  }
}
