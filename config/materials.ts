// /app/config/materials.ts

export const diamondMaterials = {
  RND: {
    main: true,
    refractionIndex: 2.41,
    color: 'e3e3e3',
    dispersion: 0.023,
    rayBounces: 4,
    envIntensity: 1.3,
    envMap: 'RND',
    envRotationHorizontal: 0,
    envRotationVertical: 25,
    redBoost: 1,
    greenBoost: 1,
    blueBoost: 1,
    colorContrast: 1,
  },
  PRINCESS: {
    main: false,
    refractionIndex: 2.41,
    color: 'ffffff',
    dispersion: 0.02,
    rayBounces: 3,
    envIntensity: 1.2,
    envMap: 'studio',
    envRotationHorizontal: 0,
    envRotationVertical: 0,
    redBoost: 1,
    greenBoost: 1,
    blueBoost: 1,
    colorContrast: 1,
  },
};
