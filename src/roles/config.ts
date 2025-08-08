export interface RoleConfig {
  [emojiId: string]: string;
}

export interface RolesConfig {
  [category: string]: RoleConfig;
}

export const ROLES: RolesConfig = {
  // Formatted 'emoji id': 'role id' // Role Name
  type: {
    '321': '123456789', // Endogenic
    '123': '123456790', // Traumagenic
    '213': '123456791'  // Unsure
  },
  pronouns: {
    '111': '123456792', // She/Her
    '1': '123456793', // He/Him
    '11': '123456794', // He/She
    '1111': '123456795', // She/They
    '11111': '123456796', // He/They
    '111111': '123456797', // They/She
    '1111111': '123456798', // They/He
    '11111111': '123456799', // They/Them
    '111111111': '123456800', // Fae/Faer
    '1111111111': '123456801', // She/Fae
    '11111111111': '123456802', // Xe/Xem
    '123': '123456803', // Ze/Zir
    '2': '123456804', // She/It
    '3': '123456805', // He/It
    '4': '123456806', // They/It
    '5': '123456807', // It/Its
    '6': '123456808', // She/Any
    '7': '123456809', // He/Any
    '8': '123456810', // She/They/He
    '9': '123456811', // He/They/She
    '10': '123456812', // They/She/Her
    '12': '123456813', // They/He/She
    '13': '123456814' // Ask
  },
  gender: {
    '1': '123456815', // Cisgender
    '123': '123456816', // Transfeminine
    '321': '123456817', // Transmasculine
    '312': '123456818', // Genderfluid
    '213': '123456819' // Non-Binary
  },
  touch: {
    '1': '123456820', // No Touching
    '2': '123456821', // Ask Before Touching
    '3': '123456822' // Touch Okay
  },
  other: {
    '111': '123456823' // Gamer
  }
};

export const ROLE_CATEGORIES = {
  type: 'System Type',
  pronouns: 'Pronouns',
  gender: 'Gender Identity',
  touch: 'Touch Preferences',
  other: 'Other'
};

// Helper function to find role by emoji ID
export function findRoleByEmojiId(emojiId: string): string | null {
  for (const category of Object.values(ROLES)) {
    if (category[emojiId]) {
      return category[emojiId];
    }
  }
  return null;
}

// Helper function to get all emoji IDs
export function getAllEmojiIds(): string[] {
  const emojiIds: string[] = [];
  for (const category of Object.values(ROLES)) {
    emojiIds.push(...Object.keys(category));
  }
  return emojiIds;
}