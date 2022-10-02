export async function fetchToText(url: string) {
  let data = await fetch(url).then((res: any) => {
    if (!res.ok) {
      throw new Error(res.status);
    }
    return res;
  });

  if (!data) {
    throw new Error(`fetch on :${url} failed`);
  }
  return await data.text();
}
