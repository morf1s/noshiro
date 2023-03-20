class Utils {
  sliceTittle(title: string, length?: number): string {
    length = length || 25;
    title =
      title.length >= length ? `${title.slice(0, length)}...` : title.slice(0, length);
    return title;
  }
}

export default Utils;