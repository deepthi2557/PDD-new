module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      function({ types: t }) {
        return {
          visitor: {
            MetaProperty(path) {
              if (path.node.meta.name === 'import' && path.node.property.name === 'meta') {
                if (path.parentPath.isMemberExpression() && path.parentPath.node.property.name === 'env') {
                  const envPath = path.parentPath;
                  envPath.replaceWith(
                    t.memberExpression(
                      t.identifier('process'),
                      t.identifier('env')
                    )
                  );
                }
              }
            }
          }
        };
      }
    ]
  };
};
