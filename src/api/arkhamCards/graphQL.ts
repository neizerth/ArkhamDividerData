import { ARKHAM_CARDS_GRAPHQL_URL } from "@/config/api";
import { IArkhamCards } from "@/types/arkhamCards";
import { IArkhamDB } from "@/types/arkhamDB";
import { gql, request } from "graphql-request";

export const loadInvestigators = async () => {
  console.log("loading Arkham Cards GraphQL Investigators");
	const document = gql`
    {
      all_card(
        where: {
          type_code: { _eq: investigator }
        }
      ) {
        position
        alternate_of_code
        code
        real_name
        real_subname
        faction_code
        pack_code
      }
    }
  `;

  type Item = {
    position: number;
    alternate_of_code: string;
    code: string;
    real_name: string;
    real_subname: string;
    faction_code: string;
    pack_code: string;  
  };

	type Response = {
		all_card: Item[];
	};

	const data = await request<Response>(ARKHAM_CARDS_GRAPHQL_URL, document);

	return data.all_card.map((card): IArkhamDB.API.Investigator => ({
		code: card.code,
		position: card.position,
		alternate_of: card.alternate_of_code,
		name: card.real_name,
		subname: card.real_subname,
		faction_code: card.faction_code,
		pack_code: card.pack_code,
		type_code: 'investigator',
	}));
};


export const loadPacks = async () => {
	console.log("loading Arkham Cards GraphQL Packs");
	const document = gql`
    {
      pack {
        code
        cycle_code
        official
        position
        real_name
        official
      }
    }
  `;

  type Item = {
    code: string;
    cycle_code: string;
    official: boolean;
    position: number;
    real_name: string;
  };

	type Response = {
		pack: Item[];
	};

	const data = await request<Response>(ARKHAM_CARDS_GRAPHQL_URL, document);

	return data.pack.map((pack): IArkhamCards.JSON.Pack => ({
		code: pack.code,
    cycle_code: pack.cycle_code,
    name: pack.real_name,
    position: pack.position,
    official: pack.official,
	}));
};

export const loadCycles = async () => {
	console.log("loading Arkham Cards Cycles");
	const document = gql`
    {
      cycle {
        code
        official
        position
        real_name
      }
    }
  `;

  type Item = {
    code: string;
    official: boolean;
    position: number;
    real_name: string;
  };


	type Response = {
		cycle: Item[];
	};

	const data = await request<Response>(ARKHAM_CARDS_GRAPHQL_URL, document);

	return data.cycle.map((cycle): IArkhamCards.JSON.Cycle => ({
		code: cycle.code,
		official: cycle.official,
		position: cycle.position,
		name: cycle.real_name,
    size: 0,
	}));
};
