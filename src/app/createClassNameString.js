export default function createClassNameString(...classes) {
  return classes.filter(Boolean).join(' ')
}
