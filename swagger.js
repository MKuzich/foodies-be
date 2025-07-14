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
      { name: 'Auth', description: 'Authentication routes' },
      { name: 'Users', description: 'User profiles and follow system' },
      { name: 'Recipes', description: 'Recipe listing and favorites' },
      { name: 'Categories', description: 'Recipe categories' },
      { name: 'Ingredients', description: 'Ingredients list' },
      { name: 'Areas', description: 'Recipe origin regions' },
      { name: 'Testimonials', description: 'User testimonials' },
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
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            avatarURL: { type: 'string', nullable: true },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        AuthToken: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Recipe: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            area: { type: 'string' },
            instructions: { type: 'string' },
            time: { type: 'string' },
            thumb: { type: 'string' },
          },
        },
        FavoriteToggle: {
          type: 'object',
          required: ['favorite'],
          properties: {
            favorite: { type: 'boolean' },
          },
        },
        FollowSummary: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            avatarURL: { type: 'string' },
            followersCount: { type: 'integer' },
            followingCount: { type: 'integer' },
            isFollowed: { type: 'boolean' },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            pages: { type: 'integer' },
          },
        },
        PaginatedUsers: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: { $ref: '#/components/schemas/User' },
            },
            pagination: { $ref: '#/components/schemas/PaginationMeta' },
          },
        },
        Testimonial: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            message: { type: 'string' },
            avatarURL: { type: 'string' },
          },
        },
        StringArray: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
