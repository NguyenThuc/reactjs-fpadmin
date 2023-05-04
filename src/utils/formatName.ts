export const formatTaskName = (route: any) => {
  const { name } = route;
  if (!name) {
    return '---';
  }
  const [_, ...subStrings] = name.split(':');
  const dateJP = new Date(route?.date);
  return `${dateJP.getMonth() + 1}月${dateJP.getDate()}日 : ${subStrings.join(
    ''
  )}`;
};
