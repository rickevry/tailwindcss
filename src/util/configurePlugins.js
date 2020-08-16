export default function(pluginConfig, plugins) {
  const pluginNames = Array.isArray(pluginConfig)
    ? pluginConfig
    : Object.keys(plugins).filter(pluginName => {
        return pluginConfig !== false && pluginConfig[pluginName] !== false
      })

  let result = pluginNames.map(pluginName => {
      let pluginResult = plugins[pluginName]();
      pluginResult.pluginName = pluginName;
      return pluginResult;
  })
  return result;
}
