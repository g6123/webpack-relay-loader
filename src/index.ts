import crypto from 'crypto';
import { parse, print } from 'graphql';
import { LoaderDefinitionFunction } from 'webpack';

const loader: LoaderDefinitionFunction = function (source) {
  const imports: string[] = [];

  const output = source.replaceAll(/graphql`([\s\S]*?)`/gm, (input, query) => {
    const formattedQuery = print(parse(query));
    const match = formattedQuery.match(/(fragment|mutation|query) (\w+)/);

    if (match == null) {
      return input;
    }

    const name = match[2];
    const id = 'graphql__' + crypto.randomBytes(10).toString('hex');

    imports.push(`import ${id} from "./__generated__/${name}.graphql.ts";`);
    return id;
  });

  return [...imports, output].join('\n');
};

export default loader;
