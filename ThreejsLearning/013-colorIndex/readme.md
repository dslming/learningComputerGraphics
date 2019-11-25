//本例实现思路：
// 1. 使用indexTexture来构建和获取颜色索引
// 2. 使用paletteTexture来作为调色板，根据索引返回真实的rgb颜色值
// 3. 选中时，通过改变paletteTexture中的颜色来改变实际使用的indexTexture颜色值

[使用索引贴图实现地图区域选中和着色](https://wow.techbrood.com/fiddle/55123)
