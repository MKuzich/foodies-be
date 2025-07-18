import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Foodies API',
      version: '1.0.0',
      description: 'API documentation for the Foodies project',
    },
    tags: [
      {name: 'Auth', description: 'Authentication routes'},
      {name: 'Users', description: 'User profiles and follow system'},
      {name: 'Recipes', description: 'Recipe listing and favorites'},
      {name: 'Categories', description: 'Recipe categories'},
      {name: 'Ingredients', description: 'Ingredients list'},
      {name: 'Areas', description: 'Recipe origin regions'},
      {name: 'Testimonials', description: 'User testimonials'},
    ],
    servers: [
      {
        url: 'https://foodies-be-oruu.onrender.com/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {type: 'string', format: 'email'},
            password: {type: 'string', minLength: 6},
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {type: 'string'},
            email: {type: 'string', format: 'email'},
            password: {type: 'string', minLength: 6},
          },
        },
        AuthToken: {
          type: 'object',
          properties: {
            token: {type: 'string'},
            user: {$ref: '#/components/schemas/User'},
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {type: 'integer'},
            name: {type: 'string'},
            email: {type: 'string'},
            avatarURL: {type: 'string', nullable: true},
          },
        },
        Owner: {
          type: 'object',
          properties: {
            id: {type: 'integer'},
            name: {type: 'string'},
            avatarURL: {type: 'string', nullable: true},
          },
        },
        CurrentUser: {
          type: 'object',
          properties: {
            id: {type: 'integer'},
            name: {type: 'string'},
            email: {type: 'string'},
            avatarURL: {type: 'string', nullable: true},
            followersCount: {type: 'integer'},
            followingCount: {type: 'integer'},
            createdCount: {type: 'integer'},
            isFollowed: {type: 'boolean'},
          },
        },
        PaginatedUsers: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {$ref: '#/components/schemas/User'},
            },
            pagination: {$ref: '#/components/schemas/PaginationMeta'},
          },
        },
        UserFollowers: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {type: 'integer'},
                  name: {type: 'string'},
                  email: {type: 'string'},
                  avatarURL: {type: 'string'},
                  ownRecipes: {type: 'integer'},
                  popularRecipes: {
                    type: 'array',
                    items: {$ref: '#/components/schemas/PopularRecipe'},
                  },
                  isFollowing: {type: 'boolean'},
                },
              },
            },
            pagination: {$ref: '#/components/schemas/PaginationMeta'},
          },
        },
        UserFollowing: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {type: 'integer'},
                  name: {type: 'string'},
                  email: {type: 'string'},
                  avatarURL: {type: 'string'},
                  ownRecipes: {type: 'integer'},
                  popularRecipes: {
                    type: 'array',
                    items: {$ref: '#/components/schemas/PopularRecipe'},
                  },
                  isFollowed: {type: 'boolean'},
                },
              },
            },
            pagination: {$ref: '#/components/schemas/PaginationMeta'},
          },
        },
        Areas: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {type: 'integer'},
              name: {type: 'string'},
              createdAt: {type: 'string', format: 'date-time'},
              updatedAt: {type: 'string', format: 'date-time'},
            },
          },
        },
        Categories: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {type: 'integer'},
              name: {type: 'string'},
              description: {type: 'string'},
              createdAt: {type: 'string', format: 'date-time'},
              updatedAt: {type: 'string', format: 'date-time'},
              recipeCount: {type: 'integer'},
            },
          },
        },
        Ingredient: {
          type: 'object',
          properties: {
            name: {type: 'string'},
            img: {type: 'string'},
            measure: {type: 'string'},
          },
        },
        Ingredients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {type: 'integer'},
              name: {type: 'string'},
              img: {type: 'string'},
            },
          },
        },
        Recipe: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            title: {type: 'string'},
            instructions: {type: 'string'},
            description: {type: 'string'},
            thumb: {type: 'string'},
            time: {type: 'string'},
            createdAt: {type: 'string', format: 'date-time'},
            updatedAt: {type: 'string', format: 'date-time'},
            category: {type: 'string'},
            area: {type: 'string'},
            owner: {$ref: '#/components/schemas/Owner'},
            ingredients: {
              type: 'array',
              items: {$ref: '#/components/schemas/Ingredient'},
            },
          },
        },
        Recipes: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {$ref: '#/components/schemas/Recipe'},
            },
            pagination: {$ref: '#/components/schemas/PaginationMeta'},
          },
        },
        RecipeWithIsFavorite: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            title: {type: 'string'},
            instructions: {type: 'string'},
            description: {type: 'string'},
            thumb: {type: 'string'},
            time: {type: 'string'},
            createdAt: {type: 'string', format: 'date-time'},
            updatedAt: {type: 'string', format: 'date-time'},
            category: {type: 'string'},
            area: {type: 'string'},
            owner: {$ref: '#/components/schemas/Owner'},
            ingredients: {
              type: 'array',
              items: {$ref: '#/components/schemas/Ingredient'},
            },
            isFavorite: {type: 'boolean'},
          },
        },
        RecipeSummary: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            title: {type: 'string'},
            description: {type: 'string'},
            thumb: {type: 'string'},
          },
        },
        RecipeSummaryWithOwner: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {type: 'string'},
              title: {type: 'string'},
              description: {type: 'string'},
              thumb: {type: 'string'},
              owner: {$ref: '#/components/schemas/Owner'},
            },
          },
        },
        PopularRecipe: {
          type: 'object',
          properties: {
            id: {type: 'integer'},
            title: {type: 'string'},
            description: {type: 'string'},
            thumb: {type: 'string'},
            owner: {$ref: '#/components/schemas/Owner'},
          },
        },
        Testimonial: {
          type: 'object',
          properties: {
            id: {type: 'integer'},
            testimonial: {type: 'string'},
            recipeId: {type: 'integer'},
            owner: {type: 'integer'},
          },
        },
        FavoriteToggle: {
          type: 'object',
          required: ['favorite'],
          properties: {
            favorite: {type: 'boolean'},
          },
        },
        FollowSummary: {
          type: 'object',
          properties: {
            id: {type: 'integer'},
            name: {type: 'string'},
            email: {type: 'string'},
            avatarURL: {type: 'string'},
            followersCount: {type: 'integer'},
            followingCount: {type: 'integer'},
            isFollowed: {type: 'boolean'},
          },
        },
        PaginatedRecipesSummary: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {$ref: '#/components/schemas/RecipeSummary'},
            },
            pagination: {$ref: '#/components/schemas/PaginationMeta'},
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: {type: 'integer'},
            limit: {type: 'integer'},
            total: {type: 'integer'},
            pages: {type: 'integer'},
          },
        },
        StringArray: {
          type: 'array',
          items: {type: 'string'},
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
